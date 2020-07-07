import { Component, OnInit } from '@angular/core';
import { SideBar } from './shared/data/right-menu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject } from 'rxjs';
const helper = new JwtHelperService();
const authorize = helper.decodeToken(JSON.parse(localStorage.getItem('rvhl_token')).token);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  rightMenu = SideBar;
  newRightMenu$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  routeId: any = [];
  isAdmin: any;
  constructor(private http: HttpClient) {
    // this.rightMenu.forEach((val) => {
    //   val['routeId'] = 'abcsdsd';
    // });
  }

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/web-config/routes`).toPromise().then(res => {
      let result;
      const data = [];
      res.data.forEach(val => {

        data.push({ id: val._id, path: val.path });

      });
      this.rightMenu.forEach((val2, index) => {
        for (let i = 0; i < data.length; i++) {
          // console.log(data[i])
          if ((data[i].path === val2.apiPath) && data[i].id !== val2.routeId) {
            val2.routeId = data[i].id;
          }
        }
        // if (data[data.length - index].path === val2.apiPath) {
        //   val2.routeId = data[index].id;
        // }
      });

      this.newRightMenu$.next(this.rightMenu);
      return data;
    }).then((res: any) => {
      // console.log(res)
      this.http.get<any>(`${environment.apiUrl}/web-config/authorize`, {
        params: {
          authorizeId: authorize.authorizeId
        }
      }).subscribe(data => {
        res.forEach((val, index) => {
          if (authorize.role !== 'admin') {
            if (data.data.routeAccept.includes(val.id) && this.routeId[index] !== val.id) {
              this.routeId.push(val.id);
            }
          }
        });
        this.isAdmin = authorize.role;
      })
    });
  }
  isPermitted(item) {
    console.log(item);
    if (this.routeId.includes(item)) {
      return true;
    }
  }
}

