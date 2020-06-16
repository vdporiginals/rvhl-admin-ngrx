import { Component, OnInit } from '@angular/core';

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
    private drawerService: NzDrawerService,
    private sharedData: SharedDataService,
    private sanitize: SanitizeHtmlPipe,
    private scheduleService: ScheduleService,
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
      this.scheduleToBeUpdated = this.value;
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
    this.http.get<any>(`${environment.apiUrl}/blogs/category`).subscribe(res => {
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
      console.log(data);
      this.inputValue = data;
      this.handleInputConfirm();
    });
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  createOrUpdate() {
    if (!this.value) {
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
