import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IReviews } from 'src/app/models/reviews.interface';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { ReviewsService } from '../reviews.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { reviewActionTypes } from 'src/app/store/actions/reviews.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-reviews-detail',
  templateUrl: './reviews-detail.component.html',
  styleUrls: ['./reviews-detail.component.scss']
})
export class ReviewsDetailComponent implements OnInit {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  isCheckedButton = true;

  reviews$: Observable<IReviews[]>;

  reviewToBeUpdated: IReviews;
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
    private reviewService: ReviewsService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    // this.images = new FormControl([]);
    this.detailForm = this.fb.group({
      title: ['', Validators.required],
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
      this.reviewToBeUpdated = this.value;
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
      this.detailForm.get('keywords').setValue(this.value.keywords);
      this.detailForm.get('isPopular').setValue(this.value.isPopular);
      this.detailForm.get('status').setValue(this.value.status);

    }
    this.http.get<any>(`${environment.apiUrl}/user-reviews/category`).subscribe(res => {
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
      this.store.dispatch(reviewActionTypes.createReview({ review: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateReview(this.detailForm.value);
    }
  }

  updateReview(updateForm) {
    const update: Update<IReviews> = {
      id: this.reviewToBeUpdated._id,
      changes: {
        ...this.reviewToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(reviewActionTypes.updateReview({ update }));

    this.isUpdateActivated = false;
    this.reviewToBeUpdated = null;

    this.drawerRef.close(this.reviewToBeUpdated);
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
