import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private subcription: Subscription;
  userDetails: any;

  changePasswordForm: FormGroup;
  isVisible = false;
  constructor(
    private noti: NotificationService,
    private fb: FormBuilder,
    private http: HttpClient, private drawerService: NzDrawerService, private router: Router) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      currentPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subcription = this.http.get<any>(`${environment.apiUrl}/auth/me`).subscribe(res => {
      this.userDetails = res.data;
    });

  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  logOut() {
    localStorage.removeItem('rvhl_token');
    this.router.navigateByUrl('/login');
  }

  updateProfile() {
    console.log(this.userDetails)
    const drawerRef = this.drawerService.create<UpdateProfileComponent, { value: any }, any>({
      nzTitle: 'Sửa profile',
      nzContent: UpdateProfileComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 310,
      nzContentParams: {
        value: this.userDetails,
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);

    });
  }
  updatePassword() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.http.put(`${environment.apiUrl}/auth/updatepassword`, this.changePasswordForm.value).subscribe(res => {
      this.noti.showSuccess('Thành công!', 'Đổi mật khẩu');
      this.isVisible = false;
    });

  }
  handleCancel(): void {
    this.isVisible = false;
  }
}
