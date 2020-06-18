import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Observable } from 'rxjs';
import { ITransfer } from 'src/app/models/transfer.interface';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { TransferService } from '../transfer.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { transferActionTypes } from 'src/app/store/actions/transfer.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-transfer-detail',
  templateUrl: './transfer-detail.component.html',
  styleUrls: ['./transfer-detail.component.scss']
})
export class TransferDetailComponent implements OnInit {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  isCheckedButton = true;
  scheduleData: any;

  transfers$: Observable<ITransfer[]>;

  transferToBeUpdated: ITransfer;
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
    private transferService: TransferService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {

    this.scheduleData = [
      {
        locationStart: '',
        locationEnd: '',
        price: ''
      }
    ];

    const phoneValid = /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g;
    // this.images = new FormControl([]);
    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      content: [''],
      description: [''],
      images: [''],
      chairNum: [''],
      locationStart: [''],
      timeStart: [''],
      schedule: this.fb.array([]),
      timePerTrip: [''],
      phone: ['', Validators.compose([Validators.pattern(phoneValid), Validators.required])],
      price: [''],
      locationEnd: [''],
      isPopular: [false],
      image: [''],
      keywords: [''],
      status: [false]
    });
  }

  get getImages() { return this.detailForm.get('images') as FormArray; }
  get formData() { return this.detailForm.get('schedule') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.transferToBeUpdated = this.value;
      this.visible = true;
      if (this.value.images !== null) {
        this.images = this.value.images;
        this.detailForm.get('images').setValue(this.images);
      }
      this.value.schedule.forEach(val => {
        const control = this.detailForm.get('schedule') as FormArray;
        control.push(this.getScheduleVal(val.locationStart, val.locationEnd, val.price));
      });

      this.detailForm.get('name').setValue(this.value.name);
      this.detailForm.get('content').setValue(this.sanitize.transform(this.value.content));
      this.detailForm.get('image').setValue(this.value.image);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('locationStart').setValue(this.value.locationStart);
      this.detailForm.get('locationEnd').setValue(this.value.locationEnd);
      this.detailForm.get('timeStart').setValue(this.value.timeStart);
      this.detailForm.get('timePerTrip').setValue(this.value.timePerTrip);
      this.detailForm.get('chairNum').setValue(this.value.chairNum);
      this.detailForm.get('price').setValue(this.value.price);
      this.detailForm.get('phone').setValue(this.value.phone);
      this.detailForm.get('category').setValue(this.value.category._id);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);
    } else {
      this.getFormSchedule();
    }
    this.http.get<any>(`${environment.apiUrl}/transfers/category`).subscribe(res => {
      this.categories = res.data;
    });
  }

  close(): void {
    this.drawerRef.close();
  }


  getFormSchedule() {
    const control = this.detailForm.get('schedule') as FormArray;
    this.scheduleData.forEach(res => {
      control.push(this.getScheduleVal(res.locationStart, res.locationEnd, res.price));
    });
  }

  getScheduleVal(locationStart, locationEnd, price) {
    return this.fb.group({
      locationStart,
      locationEnd,
      price,
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
      this.store.dispatch(transferActionTypes.createTransfer({ transfer: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateTransfer(this.detailForm.value);
    }
  }

  updateTransfer(updateForm) {
    const update: Update<ITransfer> = {
      id: this.transferToBeUpdated._id,
      changes: {
        ...this.transferToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(transferActionTypes.updateTransfer({ update }));

    this.isUpdateActivated = false;
    this.transferToBeUpdated = null;

    this.drawerRef.close(this.transferToBeUpdated);
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
