import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Update } from '@ngrx/entity';
import { ISchedule } from 'src/app/models/schedule.interface';
import { scheduleActionTypes } from 'src/app/store/actions/schedule.actions';
import { Observable } from 'rxjs';
import { ScheduleService } from '../schedule.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss']
})
export class ScheduleDetailComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'https://api.reviewhalong.vn/api/image/photos',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  visible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any;
  isCheckedButton = true;

  schedules$: Observable<ISchedule[]>;

  scheduleToBeUpdated: ISchedule;
  detailForm: FormGroup;
  isUpdateActivated = false;
  inputValue = '';

  inputVisible = false;
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  // visible = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sharedData: SharedDataService,
    private sanitize: SanitizeHtmlPipe,
    private scheduleService: ScheduleService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    this.images = new FormControl([]);
    this.detailForm = this.fb.group({
      title: ['', Validators.required],
      category: [''],
      content: [''],
      description: [''],
      images: this.images,
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

      this.visible = true;
      this.images.value = this.value.images;
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
    this.http.get<any>(`${environment.apiUrl}/blogs/category`).subscribe(res => {
      this.categories = res.data;
    });
  }

  close(): void {
    this.drawerRef.close();
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  createOrUpdate() {
    if (this.value === undefined) {
      this.store.dispatch(scheduleActionTypes.createSchedule({ schedule: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateSchedule(this.detailForm.value);
    }
  }

  updateSchedule(updateForm) {
    const update: Update<ISchedule> = {
      id: this.scheduleToBeUpdated._id,
      changes: {
        ...this.scheduleToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(scheduleActionTypes.updateSchedule({ update }));

    this.isUpdateActivated = false;
    this.scheduleToBeUpdated = null;

    this.drawerRef.close(this.scheduleToBeUpdated);
  }

  handleClose(removedTag: any): void {
    if (removedTag + 1 !== this.images.value.length) {

    } else {

      this.images.value.splice(removedTag, 1);
    }
    console.log(this.images.value.length, removedTag)
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
    if (this.inputValue && this.images.value.indexOf(this.inputValue) === -1) {
      this.images.value = [...this.images.value, this.inputValue];
    }

    this.inputValue = '';
    this.inputVisible = false;
  }

  chooseImageArray() {
  }
}
