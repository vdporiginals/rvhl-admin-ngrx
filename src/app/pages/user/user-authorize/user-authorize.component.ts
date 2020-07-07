import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-authorize',
  templateUrl: './user-authorize.component.html',
  styleUrls: ['./user-authorize.component.scss']
})
export class UserAuthorizeComponent implements OnInit {
  private subcription: Subscription;
  authorizeDetail: any;
  routeAcceptData: any;
  permission = [
    {
      name: 'Chỉ đọc',
      val: 'read'
    },
    {
      name: 'Đọc và thay đổi',
      val: 'write'
    },
    {
      name: 'Đọc, Thay đổi và Xóa',
      val: 'delete'
    }
  ];
  routeAccept: any = [];
  @Input() authorizeId?;

  authorizeForm: FormGroup;
  constructor(
    private modal: NzModalRef,
    private userService: UserService,
    private noti: NotificationService,
    private fb: FormBuilder,
    private http: HttpClient,) {
    this.authorizeForm = this.fb.group({
      permission: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getRouteAccept().toPromise().then((res: any) => {
      this.routeAcceptData = res.data;
      this.userService.getAuthorize(this.authorizeId).subscribe((res2: any) => {

        this.authorizeForm.get('permission').setValue(res2.data.permission);
        const routeAccept = res2.data.routeAccept;
        res.data.forEach(val => {
          routeAccept.forEach((val2, index) => {
            if (val._id === val2 && this.routeAccept[index] !== val._id) {
              this.routeAccept.push(val2);
            }
          });
        });
      });
    });
  }

  updateAuthorize() {
    this.userService.setAuthorize(this.authorizeId, {
      permission: this.authorizeForm.get('permission').value,
      routeAccept: this.routeAccept
    }).subscribe(res => {
      console.log(res);
    })
    this.modal.destroy();
  }

  destroyModal() {
    this.modal.destroy();
  }
}
