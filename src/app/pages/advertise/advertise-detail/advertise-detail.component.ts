import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdvertise } from 'src/app/models/advertise.interface';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { AdvertiseService } from '../advertise.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { advertiseActionTypes } from 'src/app/store/actions/advertise.actions';
import { Update } from '@ngrx/entity';
import { pagePosition } from './page-position';

@Component({
  selector: 'app-advertise-detail',
  templateUrl: './advertise-detail.component.html',
  styleUrls: ['./advertise-detail.component.scss']
})
export class AdvertiseDetailComponent implements OnInit {

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  isCheckedButton = true;
  pagePositions = pagePosition;
  typeAdvertises = [{ value: 'BannerPage', name: 'Banner Trang' }, { value: 'Advertise', name: 'Quảng cáo trang' }];
  advertises$: Observable<IAdvertise[]>;

  advertiseToBeUpdated: IAdvertise;
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
    private advertiseService: AdvertiseService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    // this.images = new FormControl([]);
    this.detailForm = this.fb.group({
      title: ['', Validators.required],
      link: [''],
      pagePosition: [''],
      video: [''],
      typeAdvertise: [''],
      category: [''],
      content: [''],
      description: [''],
      images: [''],
      address: [''],
      isPopular: [false],
      image: [''],
      keywords: [''],
      status: [false]
    });
  }

  get getImages() { return this.detailForm.get('images') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.advertiseToBeUpdated = this.value;
      this.visible = true;
      if (this.value.images !== null) {
        this.images = this.value.images;
        this.detailForm.get('images').setValue(this.images);
      }
      this.detailForm.get('title').setValue(this.value.title);
      this.detailForm.get('content').setValue(this.sanitize.transform(this.value.content));
      this.detailForm.get('image').setValue(this.value.image);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('address').setValue(this.value.address);
      this.detailForm.get('category').setValue(this.value.category);
      this.detailForm.get('link').setValue(this.value.link);
      this.detailForm.get('video').setValue(this.value.video);
      this.detailForm.get('typeAdvertise').setValue(this.value.typeAdvertise);
      this.detailForm.get('pagePosition').setValue(this.value.pagePosition);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);
    }
    this.http.get<any>(`${environment.apiUrl}/advertises/category`).subscribe(res => {
      this.categories = res.data;
      console.log(this.categories);
    });
  }

  close(): void {
    this.drawerRef.close();
  }

  showImagePicker() {
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
      this.detailForm.get('image').setValue(data);
    });
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  createOrUpdate() {
    if (!this.value) {
      this.store.dispatch(advertiseActionTypes.createAdvertise({ advertise: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateAdvertise(this.detailForm.value);
    }
  }

  updateAdvertise(updateForm) {
    const update: Update<IAdvertise> = {
      id: this.advertiseToBeUpdated._id,
      changes: {
        ...this.advertiseToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(advertiseActionTypes.updateAdvertise({ update }));

    this.isUpdateActivated = false;
    this.advertiseToBeUpdated = null;

    this.drawerRef.close(this.advertiseToBeUpdated);
  }

}
