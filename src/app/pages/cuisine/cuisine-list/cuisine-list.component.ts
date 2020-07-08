import { Component, OnInit } from '@angular/core';
import { ICuisine } from 'src/app/models/cuisine.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { CuisineService } from '../cuisine.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllCuisines, areCuisinesLoaded, getPagination } from 'src/app/store/selectors/cuisine.selectors';
import { cuisineActionTypes, loadCuisines } from 'src/app/store/actions/cuisine.actions';
import { CuisineDetailComponent } from '../cuisine-detail/cuisine-detail.component';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-cuisine-list',
  templateUrl: './cuisine-list.component.html',
  styleUrls: ['./cuisine-list.component.scss']
})
export class CuisineListComponent implements OnInit {
  total = 1;
  listCuisine: ICuisine[] = [];
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

  cuisines$: Observable<ICuisine[]>;
  pagination$: Observable<any>;

  cuisineToBeUpdated: ICuisine;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private cuisineService: CuisineService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.cuisines$ = this.store.select(getAllCuisines);
    this.pagination$ = this.store.select(getPagination);
    this.pagination$.subscribe(res => {
      this.pageIndex = res.pageNum;
      this.total = res.count;
    });
  }

  deleteCuisine(id: string) {
    this.store.dispatch(cuisineActionTypes.deleteCuisine({ cuisineId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<CuisineDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Nhà hàng(Ẩm thực)',
      nzContent: CuisineDetailComponent,
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
      this.cuisines$ = this.store.select(getAllCuisines);
      this.store.dispatch(loadCuisines({
        params: {
          limit: 10,
          page: 1
        }
      }));
    });
  }

  showUpdateForm(cuisine: ICuisine) {
    this.cuisineToBeUpdated = { ...cuisine };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<CuisineDetailComponent>({
      nzTitle: 'Cập nhật Nhà hàng(Ẩm thực)',
      nzContent: CuisineDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.cuisineToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.cuisines$ = this.store.select(getAllCuisines);
      this.store.dispatch(loadCuisines({
        params: {
          limit: 10,
          page: 1
        }
      }));
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

    this.store.dispatch(cuisineActionTypes.loadCuisines({ params }));

    this.store
      .pipe(
        select(areCuisinesLoaded),
        filter(cuisinesLoaded => cuisinesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.cuisines$ = this.store.select(getAllCuisines);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(cuisineActionTypes.updateCuisine({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areCuisinesLoaded),
        filter(cuisinesLoaded => cuisinesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.cuisines$ = this.store.select(getAllCuisines);
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
    } else {
      this.loadDataFromServer(pageIndex, pageSize, null, null, [])
    }
  }

}
