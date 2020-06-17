import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ITour } from 'src/app/models/tour.interface';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { TourService } from '../tour.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { tourActionTypes } from 'src/app/store/actions/tour.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss']
})
export class TourDetailComponent implements OnInit {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  isCheckedButton = true;
  positions = [
    {
      name: 'Tour Vịnh', value: 'TourCruise'
    },
    {
      value: 'TourAll', name: 'Tour Trọn gói',
    },
    { name: 'Tour Hạ Long', value: 'TourHaLong' }];

  tours$: Observable<ITour[]>;
  scheduleData: any;
  tourToBeUpdated: ITour;
  detailForm: FormGroup;
  isUpdateActivated = false;
  inputValue = '';

  inputVisible = false;
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  // visible = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private drawerService: NzDrawerService,
    private sharedData: SharedDataService,
    private sanitize: SanitizeHtmlPipe,
    private tourService: TourService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    this.scheduleData = [
      {
        timeStart: '',
        timeEnd: '',
        location: '',
        service: ''
      }
    ];
    // this.images = new FormControl([]);
    this.detailForm = this.fb.group({
      title: ['', Validators.required],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(20)])],
      customerNum: [''],
      description: [''],
      images: [''],
      schedule: this.fb.array([]),
      time: [''],
      image: [''],
      content: [''],
      price: ['', Validators.compose([Validators.required])],
      address: [''],
      category: [''],
      position: [''],
      keywords: [''],
      video: [''],
      isPopular: [false],
      status: [false, Validators.required]
    });
  }

  get formData() { return this.detailForm.get('schedule') as FormArray; }
  get getImages() { return this.detailForm.get('images') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.tourToBeUpdated = this.value;
      this.visible = true;
      if (this.value.images !== null) {
        this.images = this.value.images;
        this.detailForm.get('images').setValue(this.images);
      }
      this.value.schedule.forEach(val => {
        const control = this.detailForm.get('schedule') as FormArray;
        control.push(this.getScheduleVal(val.timeStart, val.timeEnd, val.location, val.service));
      });
      this.detailForm.get('title').setValue(this.value.title);
      this.detailForm.get('price').setValue(this.value.price);
      this.detailForm.get('phone').setValue(this.value.phone);
      this.detailForm.get('image').setValue(this.value.image);
      this.detailForm.get('content').setValue(this.sanitize.transform(this.value.content));
      this.detailForm.get('video').setValue(this.value.video);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('address').setValue(this.value.address);
      this.detailForm.get('customerNum').setValue(this.value.customerNum);
      this.detailForm.get('time').setValue(this.value.time);
      this.detailForm.get('category').setValue(this.value.category._id);
      this.detailForm.get('position').setValue(this.value.position);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);
    } else {

      this.getFormSchedule();
    }
    this.http.get<any>(`${environment.apiUrl}/tours/category`).subscribe(res => {
      this.categories = res.data;
    });
  }

  close(): void {
    this.drawerRef.close();
  }
  onOk(result: Date | Date[] | null, index): void {
    console.log('onOk', result);
    const control = this.detailForm.get('schedule') as FormArray;
    control.at(index).patchValue({
      timeStart: result[0],
      timeEnd: result[1]
    })
    // control.push(this.getScheduleVal(val.timeStart, val.timeEnd, val.location, val.service));
    // this.detailForm.get('servicetimeStart').patchValue();
    // this.detailForm.get('timeEnd').patchValue();
  }

  getFormSchedule() {
    const control = this.detailForm.get('schedule') as FormArray;
    this.scheduleData.forEach(res => {
      control.push(this.getScheduleVal(res.timeStart, res.timeEnd, res.location, res.service));
    });
  }

  getScheduleVal(tStart, tEnd, location, service) {
    return this.fb.group({
      timeStart: tStart,
      timeEnd: tEnd,
      location,
      service
    });
  }

  showImagePicker(type?) {
    const drawerRef = this.drawerService.create<ImageDrawerComponent>({
      nzTitle: 'Quản lý hình ảnh',
      nzContent: ImageDrawerComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      if (type === 'images') {
        this.inputValue = data;
        this.handleInputConfirm();
      } else {
        this.detailForm.get('image').setValue(data);
      }
    });
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  createOrUpdate() {
    if (!this.value) {
      this.store.dispatch(tourActionTypes.createTour({ tour: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateTour(this.detailForm.value);
    }
  }

  updateTour(updateForm) {
    const update: Update<ITour> = {
      id: this.tourToBeUpdated._id,
      changes: {
        ...this.tourToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(tourActionTypes.updateTour({ update }));

    this.isUpdateActivated = false;
    this.tourToBeUpdated = null;

    this.drawerRef.close(this.tourToBeUpdated);
  }

  handleClose(removedTag: any): void {

    this.images.splice(removedTag, 1);
    console.log(this.images.length, removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 10;
    return isLongTag ? `${tag.slice(0, 10)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue !== '' && this.images.length !== 0) {
      this.images = [...this.images, this.inputValue];
      this.detailForm.get('images').setValue(this.images);
    } else if (this.inputValue !== '' && this.images.length === 0) {
      this.images.push(this.inputValue);
      this.detailForm.get('images').setValue(this.images);
    }

    this.inputValue = '';
    this.inputVisible = false;
  }

  chooseImageArray() {
  }
}
