import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IAccommodation } from 'src/app/models/accommodation.interface';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { AccommodationService } from '../accommodation.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { accommodationActionTypes } from 'src/app/store/actions/accommodation.actions';
import { Update } from '@ngrx/entity';
import { ActivatedRoute, Event, Router, NavigationEnd } from '@angular/router';
import { areAccommodationsLoaded } from 'src/app/store/selectors/accommodation.selectors';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-accommodation-detail',
  templateUrl: './accommodation-detail.component.html',
  styleUrls: ['./accommodation-detail.component.scss']
})
export class AccommodationDetailComponent implements OnInit, OnDestroy {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  services: any = [];
  isCheckedButton = true;
  private storeSubcription: Subscription;

  accommodations$: Observable<IAccommodation[]>;
  routePathName: string;
  accommodationToBeUpdated: IAccommodation;
  detailForm: FormGroup;
  isUpdateActivated = false;
  inputValue = '';
  serviceValue = '';
  inputVisible = false;
  serviceVisible = false;
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  @ViewChild('serviceElement', { static: false }) serviceElement?: ElementRef;

  // visible = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private drawerService: NzDrawerService,
    private sharedData: SharedDataService,
    private sanitize: SanitizeHtmlPipe,
    private route: ActivatedRoute, private router: Router,
    private accommodationService: AccommodationService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    this.storeSubcription = this.store
      .pipe(
        select(areAccommodationsLoaded),
        tap((accommodationsLoaded) => {
          const path = accommodationsLoaded.apiName;
          if (path === 'hotel') {
            this.routePathName = 'hotel';
          } else if (path === 'homestay') {
            this.routePathName = 'homestay';
          } else if (path === 'villa') {
            this.routePathName = 'villa';
          } else {

          }
        })).subscribe();

    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(20)])],
      roomNum: [''],
      description: [''],
      showHomepage: [false],
      images: [''],
      views: [''],
      image: [''],
      content: [''],
      price: [''],
      address: [''],
      services: [''],
      category: ['', Validators.required],
      facilities: new FormGroup({
        square: new FormControl(0),
        other: new FormControl(''),
        meetingRoom: new FormControl(false),
        oceanViews: new FormControl(false),
        pool: new FormControl(false),
        restaurant: new FormControl(false),
        kitchen: new FormControl(false),
        bbqArea: new FormControl(false),
      }),
      keywords: [''],
      isPopular: [false],
      status: [false]
    });
  }

  get getImages() { return this.detailForm.get('images') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.accommodationToBeUpdated = this.value;
      this.visible = true;
      if (this.value.images !== null) {
        this.images = this.value.images;
        this.detailForm.get('images').setValue(this.images);
      }

      this.detailForm.get('name').setValue(this.value.name);
      this.detailForm.get('price').setValue(this.value.price);
      this.detailForm.get('image').setValue(this.value.image);
      this.detailForm.get('phone').setValue(this.value.phone);
      this.detailForm.get('content').setValue(this.sanitize.transform(this.value.content));
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('showHomepage').setValue(this.value.showHomepage);
      this.detailForm.get('address').setValue(this.value.address);
      this.detailForm.get('roomNum').setValue(this.value.roomNum);
      this.detailForm.get('views').setValue(this.value.views);
      this.detailForm.get('category').setValue(this.value.category);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);
      if (this.routePathName === 'hotel' || this.routePathName === 'villa') {
        this.detailForm.get('facilities.restaurant').setValue(this.value.facilities.restaurant);
        this.detailForm.get('facilities.meetingRoom').setValue(this.value.facilities.meetingRoom);
      }

      if (this.routePathName === 'homestay' || this.routePathName === 'villa') {
        this.detailForm.get('facilities.kitchen').setValue(this.value.facilities.kitchen);
      }

      if (this.routePathName === 'villa') {
        this.services = this.value.services;
        this.detailForm.get('services').setValue(this.value.services);
        this.detailForm.get('facilities.bbqArea').setValue(this.value.facilities.bbqArea);
      }

      this.detailForm.get('facilities.other').setValue(this.value.facilities.other);
      this.detailForm.get('facilities.pool').setValue(this.value.facilities.pool);
      this.detailForm.get('facilities.oceanViews').setValue(this.value.facilities.oceanViews);
      this.detailForm.get('facilities.square').setValue(this.value.facilities.square);
    }

    this.http.get<any>(`${environment.apiUrl}/estates/category`, {
      params: {
        position: this.routePathName.replace(/(^\w{1})/g, match => match.toUpperCase())
      }
    }).subscribe(res => {
      this.categories = res.data;
    });
  }

  ngOnDestroy() {
    this.storeSubcription.unsubscribe();
  }
  close(): void {
    this.drawerRef.close();
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
      this.store.dispatch(accommodationActionTypes.createAccommodation({ apiName: this.routePathName, accommodation: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateAccommodation(this.detailForm.value);
    }
  }

  updateAccommodation(updateForm) {
    const update: Update<IAccommodation> = {
      id: this.accommodationToBeUpdated._id,
      changes: {
        ...this.accommodationToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(accommodationActionTypes.updateAccommodation({ apiName: this.routePathName, update }));

    this.isUpdateActivated = false;
    this.accommodationToBeUpdated = null;

    this.drawerRef.close(this.accommodationToBeUpdated);
  }

  handleClose(removedTag: any): void {
    this.images.splice(removedTag, 1);
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

  handleServiceClose(removedTag: any): void {
    this.services.splice(removedTag, 1);
  }

  showService(): void {
    this.serviceVisible = true;
    setTimeout(() => {
      this.serviceElement?.nativeElement.focus();
    }, 10);
  }

  handleServiceConfirm(): void {
    if (this.serviceValue !== '' && this.services.length !== 0) {
      this.services = [...this.services, this.serviceValue];
      this.detailForm.get('services').setValue(this.services);
    } else if (this.serviceValue !== '' && this.services.length === 0) {
      this.services.push(this.serviceValue);
      this.detailForm.get('services').setValue(this.services);
    }

    this.serviceValue = '';
    this.serviceVisible = false;
  }

  chooseImageArray() {
  }
}
