import { Component, OnInit, Input } from '@angular/core';
import { ImageDrawerComponent } from 'src/app/shared/image-drawer/image-drawer.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  @Input() value;
  detailForm: FormGroup;
  constructor(
    private noti: NotificationService,
    private fb: FormBuilder,
    private http: HttpClient,
    private drawerService: NzDrawerService,
    private drawerRef: NzDrawerRef<any>) {

    const phoneValid = /^[0]{1}[2]{1}[0-9]\d{8}$|^[0]{1}([3]|[5]|[9]|[7]|[8]){1}[0-9]\d{7}?$/g;
    const emailValid = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
    this.detailForm = this.fb.group({
      email: ['', Validators.compose([Validators.pattern(emailValid), Validators.required])],
      name: [''],
      phone: ['', Validators.compose([Validators.pattern(phoneValid)])],
      description: [''],
      avatar: [''],
    });
  }

  ngOnInit(): void {
    this.getDetailEdit();
  }

  getDetailEdit() {
    this.detailForm.get('email').setValue(this.value.email);
    this.detailForm.get('name').setValue(this.value.name);
    this.detailForm.get('avatar').setValue(this.value.avatar);
    this.detailForm.get('description').setValue(this.value.description);
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
      this.detailForm.get('avatar').setValue(data);
    });
  }

  updateProfile() {
    this.http.put(`${environment.apiUrl}/auth/updatedetails`, this.detailForm.value).subscribe(res => {
      this.noti.showSuccess('Thành công!', 'Sửa profile');
      this.drawerRef.close();
    });
  }
}
