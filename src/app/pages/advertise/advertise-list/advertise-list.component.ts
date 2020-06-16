import { Component, OnInit } from '@angular/core';
import { IAdvertise } from 'src/app/models/advertise.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { AdvertiseService } from '../advertise.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllAdvertises, areAdvertisesLoaded } from 'src/app/store/selectors/advertise.selectors';
import { advertiseActionTypes } from 'src/app/store/actions/advertise.actions';
import { AdvertiseDetailComponent } from '../advertise-detail/advertise-detail.component';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-advertise-list',
  templateUrl: './advertise-list.component.html',
  styleUrls: ['./advertise-list.component.scss']
})
export class AdvertiseListComponent implements OnInit {
  total = 1;
  listAdvertise: IAdvertise[] = [];
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

  advertises$: Observable<IAdvertise[]>;

  advertiseToBeUpdated: IAdvertise;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private advertiseService: AdvertiseService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.advertises$ = this.store.select(getAllAdvertises);
  }

  deleteAdvertise(id: string) {
    this.store.dispatch(advertiseActionTypes.deleteAdvertise({ advertiseId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<AdvertiseDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Lịch Trình',
      nzContent: AdvertiseDetailComponent,
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
      this.advertises$ = this.store.select(getAllAdvertises);
    });
  }

  showUpdateForm(advertise: IAdvertise) {
    this.advertiseToBeUpdated = { ...advertise };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<AdvertiseDetailComponent>({
      nzTitle: 'Cập nhật Lịch Trình',
      nzContent: AdvertiseDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.advertiseToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.advertises$ = this.store.select(getAllAdvertises);
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

    this.store.dispatch(advertiseActionTypes.loadAdvertises({ params }));

    this.store
      .pipe(
        select(areAdvertisesLoaded),
        filter(advertisesLoaded => advertisesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.advertises$ = this.store.select(getAllAdvertises);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(advertiseActionTypes.updateAdvertise({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areAdvertisesLoaded),
        filter(advertisesLoaded => advertisesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.advertises$ = this.store.select(getAllAdvertises);
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
