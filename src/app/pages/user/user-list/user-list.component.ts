import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllUsers, areUsersLoaded } from 'src/app/store/selectors/user.selectors';
import { userActionTypes, loadUsers } from 'src/app/store/actions/user.actions';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { filter, first } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserAuthorizeComponent } from '../user-authorize/user-authorize.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  total = 1;
  listUser: IUser[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterName = '';

  filterEmail = '';
  size: NzButtonSize = 'default';
  isFilter: boolean;

  visible = false;

  users$: Observable<IUser[]>;

  userToBeUpdated: IUser;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private userService: UserService, private drawerService: NzDrawerService, private modalService: NzModalService,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.users$ = this.store.select(getAllUsers);
  }

  deleteUser(id: string) {
    this.store.dispatch(userActionTypes.deleteUser({ userId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<UserDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Vận chuyển',
      nzContent: UserDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.users$ = this.store.select(getAllUsers);
      this.store.dispatch(loadUsers({
        params: {
          limit: 10,
          page: 1
        }
      }));
    });
  }

  showAuthorizeConfig(authorizeId) {
    this.modalService.create({
      nzTitle: 'Thiết lập phân quyền',
      nzContent: UserAuthorizeComponent,
      nzComponentParams: {
        authorizeId
      }
    });
  }

  showUpdateForm(user: IUser) {
    this.userToBeUpdated = { ...user };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<UserDetailComponent>({
      nzTitle: 'Cập nhật Vận chuyển',
      nzContent: UserDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.userToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.users$ = this.store.select(getAllUsers);
      this.store.dispatch(loadUsers({
        params: {
          limit: 10,
          page: 1
        }
      }));
    });
  }

  reset(): void {
    this.filterName = '';
    this.filterEmail = '';
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    selected: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    let newSort = '';
    let order = '+';
    const newSelected = [];
    // let selectedVal;

    if (sortOrder === 'ascend') {
      order = '+';
    } else {
      order = '-';
    }

    if (sortField !== null) {
      newSort = `${order}${sortField}`;
    } else {
      newSort = '';
    }

    let params = {
      page: pageIndex,
      limit: pageSize,
      sort: newSort,
    };

    selected.forEach(val => {
      newSelected.push({
        name: val.key,
        value: val.value
      });
    });

    newSelected.forEach(val => {
      if (val.value.length > 1) {
        params = params;
      } else {
        params[val.name] = val.value;
      }
    });

    if (this.filterName !== '') {
      // tslint:disable-next-line: no-string-literal
      params['name'] = this.filterName;
    }
    if (this.filterEmail !== '') {
      params['email'] = this.filterEmail;
    }

    this.store.dispatch(userActionTypes.loadUsers({ params }));

    this.store
      .pipe(
        select(areUsersLoaded),
        filter(usersLoaded => usersLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.users$ = this.store.select(getAllUsers);
  }


  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    // let isFilter = false;
    filter.forEach(val => {

      // console.log(val.value.length)
      if (val.value.length !== 0) {
        this.isFilter = true;
      } else {
        this.isFilter = false;
      }
    });

    if (currentSort !== undefined || this.isFilter === true) {
      this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
    }
  }
}
