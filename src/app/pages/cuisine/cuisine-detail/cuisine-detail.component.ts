import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ICuisine } from 'src/app/models/cuisine.interface';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { CuisineService } from '../cuisine.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { cuisineActionTypes } from 'src/app/store/actions/cuisine.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-cuisine-detail',
  templateUrl: './cuisine-detail.component.html',
  styleUrls: ['./cuisine-detail.component.scss']
})
export class CuisineDetailComponent implements OnInit {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  menuData: any;
  gallery: any = [];
  isCheckedButton = true;

  cuisines$: Observable<ICuisine[]>;

  cuisineToBeUpdated: ICuisine;
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
    private cuisineService: CuisineService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    // this.gallery = new FormControl([]);
    this.menuData = [
      {
        name: '',
        price: '',
        description: '',
        image: ''
      }
    ];

    const phoneValid = /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g;
    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      content: [''],
      address: [''],
      description: [''],
      gallery: [''],
      views: [''],
      menu: this.fb.array([]),
      phone: ['', Validators.compose([Validators.pattern(phoneValid), Validators.required])],
      price: [''],
      isPopular: [false],
      image: [''],
      keywords: [''],
      status: [false]
    });
  }

  get getGallery() { return this.detailForm.get('gallery') as FormArray; }
  get formData() { return this.detailForm.get('menu') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.cuisineToBeUpdated = this.value;
      this.visible = true;
      if (this.value.gallery !== null) {
        this.gallery = this.value.gallery;
        this.detailForm.get('gallery').setValue(this.gallery);
      }
      this.value.menu.forEach(val => {
        const control = this.detailForm.get('menu') as FormArray;
        control.push(this.getMenuVal(val.name, val.description, val.price, val.image));
      });
      this.detailForm.get('name').setValue(this.value.name);
      this.detailForm.get('content').setValue(this.sanitize.transform(this.value.content));
      this.detailForm.get('image').setValue(this.value.image);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('views').setValue(this.value.views);
      this.detailForm.get('address').setValue(this.value.address);
      this.detailForm.get('price').setValue(this.value.price);
      this.detailForm.get('phone').setValue(this.value.phone);
      this.detailForm.get('category').setValue(this.value.category._id);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);
    } else {
      this.getFormMenu();
    }
    this.http.get<any>(`${environment.apiUrl}/restaurants/category`).subscribe(res => {
      this.categories = res.data;
      console.log(this.categories);
    });

  }

  close(): void {
    this.drawerRef.close();
  }

  showImagePicker(type?, index?) {
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
      if (type === 'menu') {
        if (data !== null && data !== undefined) {

          const control = this.detailForm.get('menu') as FormArray;
          control.at(index).patchValue({ image: data });
        }
      }
      if (type === 'images') {
        if (data !== null && data !== undefined) {
          this.inputValue = data;
          this.handleInputConfirm();
        }
      } else {
        this.detailForm.get('image').setValue(data);
      }
    });
  }

  getFormMenu() {
    const control = this.detailForm.get('menu') as FormArray;
    this.menuData.forEach(res => {
      control.push(this.getMenuVal(res.name, res.description, res.price, res.image));
    });
  }

  getMenuVal(name, description, price, image) {
    return this.fb.group({
      name,
      description,
      price,
      image
    });
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  createOrUpdate() {
    if (!this.value) {
      this.store.dispatch(cuisineActionTypes.createCuisine({ cuisine: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateCuisine(this.detailForm.value);
    }
  }

  updateCuisine(updateForm) {
    const update: Update<ICuisine> = {
      id: this.cuisineToBeUpdated._id,
      changes: {
        ...this.cuisineToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(cuisineActionTypes.updateCuisine({ update }));

    this.isUpdateActivated = false;
    this.cuisineToBeUpdated = null;

    this.drawerRef.close(this.cuisineToBeUpdated);
  }

  handleClose(removedTag: any): void {

    this.gallery.splice(removedTag, 1);
    console.log(this.gallery.length, removedTag);
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
    if (this.inputValue !== '' && this.gallery.length !== 0) {
      this.gallery = [...this.gallery, this.inputValue];
      this.detailForm.get('gallery').setValue(this.gallery);
    } else if (this.inputValue !== '' && this.gallery.length === 0) {
      this.gallery.push(this.inputValue);
      this.detailForm.get('gallery').setValue(this.gallery);
    }

    this.inputValue = '';
    this.inputVisible = false;
  }

  chooseImageArray() {
  }

}
