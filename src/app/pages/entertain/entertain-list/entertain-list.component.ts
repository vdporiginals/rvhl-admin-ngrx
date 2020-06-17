import { Component, OnInit } from '@angular/core';
import { IEntertain } from 'src/app/models/entertain.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { EntertainService } from '../entertain.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllEntertains, areEntertainsLoaded } from 'src/app/store/selectors/entertain.selectors';
import { EntertainDetailComponent } from '../entertain-detail/entertain-detail.component';
import { entertainActionTypes } from 'src/app/store/actions/entertain.actions';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-entertain-list',
  templateUrl: './entertain-list.component.html',
  styleUrls: ['./entertain-list.component.scss']
})
export class EntertainListComponent implements OnInit {
  total = 1;
  listEntertain: IEntertain[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterName = '';
  filterStatus = [
    { text: 'Kích hoạt', value: 'true' },
    { text: 'Chưa kích hoạt', value: 'false' }
  ];
  size: NzButtonSize = 'default';
  isFilter: boolean;

  visible = false;

  entertains$: Observable<IEntertain[]>;

  entertainToBeUpdated: IEntertain;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private entertainService: EntertainService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.entertains$ = this.store.select(getAllEntertains);
  }

  deleteEntertain(id: string) {
    this.store.dispatch(entertainActionTypes.deleteEntertain({ entertainId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<EntertainDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm giải trí',
      nzContent: EntertainDetailComponent,
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
      this.entertains$ = this.store.select(getAllEntertains);
    });
  }

  showUpdateForm(entertain: IEntertain) {
    this.entertainToBeUpdated = { ...entertain };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<EntertainDetailComponent>({
      nzTitle: 'Cập nhật giải trí',
      nzContent: EntertainDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.entertainToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.entertains$ = this.store.select(getAllEntertains);
    });
  }

  reset(): void {
    this.filterName = '';
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
    let newSelected = [];
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
    }

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

    this.store.dispatch(entertainActionTypes.loadEntertains({ params }));

    this.store
      .pipe(
        select(areEntertainsLoaded),
        filter(entertainsLoaded => entertainsLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.entertains$ = this.store.select(getAllEntertains);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(entertainActionTypes.updateEntertain({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areEntertainsLoaded),
        filter(entertainsLoaded => entertainsLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.entertains$ = this.store.select(getAllEntertains);
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
