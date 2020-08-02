import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IUser } from 'src/app/models/user.interface';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { UserService } from '../user.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { userActionTypes } from 'src/app/store/actions/user.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  visible = false;
  childrenVisible = false;
  @Input() value;
  @Input() category;
  categories: any;
  images: any = [];
  isCheckedButton = true;
  scheduleData: any;

  users$: Observable<IUser[]>;

  userToBeUpdated: IUser;
  detailForm: FormGroup;
  isUpdateActivated = false;
  inputValue = '';
  roles = ['admin', 'moderator', 'user'];
  inputVisible = false;
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  // visible = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private drawerService: NzDrawerService,
    private sharedData: SharedDataService,
    private sanitize: SanitizeHtmlPipe,
    private userService: UserService,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {

    const phoneValid = /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}$/g;
    // this.images = new FormControl([]);
    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      phone: ['', Validators.compose([Validators.pattern(phoneValid)])],
      avatar: [''],
      password: [''],
      role: [''],
      email: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.value !== undefined) {
      this.userToBeUpdated = this.value;
      this.visible = true;
      this.detailForm.get('name').setValue(this.value.name);
      this.detailForm.get('email').setValue(this.value.email);
      this.detailForm.get('avatar').setValue(this.value.avatar);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('role').setValue(this.value.role);
      this.detailForm.get('phone').setValue(this.value.phone);
    }
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
      this.detailForm.get('avatar').setValue(data);
    });
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  createOrUpdate() {
    if (!this.value) {
      this.store.dispatch(userActionTypes.createUser({ user: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateUser(this.detailForm.value);
    }
  }

  updateUser(updateForm) {
    const update: Update<IUser> = {
      id: this.userToBeUpdated._id,
      changes: {
        ...this.userToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(userActionTypes.updateUser({ update }));

    this.isUpdateActivated = false;
    this.userToBeUpdated = null;

    this.drawerRef.close(this.userToBeUpdated);
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
