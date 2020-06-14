import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.authService.signIn(this.loginForm.value).then(res => {
      this.noti.showSuccess('Đăng nhập Thành công', '');
      this.router.navigate(['']);
      window.location.reload();
    }).catch(error => {
      console.log(error)
      this.noti.showError('Đăng nhập Thất bại', error.error);
      // this.loading = false;
    });
  }

  constructor(
    private noti: NotificationService,
    private sharedData: SharedDataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

}
