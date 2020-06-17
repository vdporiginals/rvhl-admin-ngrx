import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IEntertain } from 'src/app/models/entertain.interface';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { EntertainService } from '../entertain.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { entertainActionTypes } from 'src/app/store/actions/entertain.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-entertain-detail',
  templateUrl: './entertain-detail.component.html',
  styleUrls: ['./entertain-detail.component.scss']
})
export class EntertainDetailComponent implements OnInit {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  isCheckedButton = true;

  entertains$: Observable<IEntertain[]>;

  entertainToBeUpdated: IEntertain;
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
    private entertainService: EntertainService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    const phoneValid = /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g;
    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      content: [''],
      description: [''],
      video: [''],
      price: [''],
      images: [''],
      address: [''],
      phone: ['', Validators.compose([Validators.pattern(phoneValid), Validators.required])],
      isPopular: [false],
      image: [''],
      keywords: [''],
      status: [false]
    });
  }

  get getImages() { return this.detailForm.get('images') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.entertainToBeUpdated = this.value;
      this.visible = true;
      if (this.value.images !== null) {
        this.images = this.value.images;
        this.detailForm.get('images').setValue(this.images);
      }
      if (this.value.category !== undefined) {
        this.detailForm.get('category').setValue(this.value.category);
      }
      this.detailForm.get('name').setValue(this.value.name);
      this.detailForm.get('content').setValue(this.sanitize.transform(this.value.content));
      this.detailForm.get('image').setValue(this.value.image);
      this.detailForm.get('video').setValue(this.value.video);
      this.detailForm.get('price').setValue(this.value.price);
      this.detailForm.get('phone').setValue(this.value.phone);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('address').setValue(this.value.address);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);
    }
    this.http.get<any>(`${environment.apiUrl}/entertains/category`).subscribe(res => {
      this.categories = res.data;
    });
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
      this.store.dispatch(entertainActionTypes.createEntertain({ entertain: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateEntertain(this.detailForm.value);
    }
  }

  updateEntertain(updateForm) {
    const update: Update<IEntertain> = {
      id: this.entertainToBeUpdated._id,
      changes: {
        ...this.entertainToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(entertainActionTypes.updateEntertain({ update }));

    this.isUpdateActivated = false;
    this.entertainToBeUpdated = null;

    this.drawerRef.close(this.entertainToBeUpdated);
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
