import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ITour } from 'src/app/models/tour.interface';
import { Observable, Subscription } from 'rxjs';
import { TourService } from '../tour.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllTours, areToursLoaded } from 'src/app/store/selectors/tour.selectors';
import { tourActionTypes } from 'src/app/store/actions/tour.actions';
import { TourDetailComponent } from '../tour-detail/tour-detail.component';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {
  total = 1;
  listTour: ITour[] = [];
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

  tours$: Observable<ITour[]>;

  tourToBeUpdated: ITour;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private tourService: TourService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.tours$ = this.store.select(getAllTours);
  }

  deleteTour(id: string) {
    this.store.dispatch(tourActionTypes.deleteTour({ tourId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<TourDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Lịch Trình',
      nzContent: TourDetailComponent,
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
      this.tours$ = this.store.select(getAllTours);
    });
  }

  showUpdateForm(tour: ITour) {
    this.tourToBeUpdated = { ...tour };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<TourDetailComponent>({
      nzTitle: 'Cập nhật Lịch Trình',
      nzContent: TourDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.tourToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.tours$ = this.store.select(getAllTours);
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

    this.store.dispatch(tourActionTypes.loadTours({ params }));

    this.store
      .pipe(
        select(areToursLoaded),
        filter(toursLoaded => toursLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.tours$ = this.store.select(getAllTours);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(tourActionTypes.updateTour({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areToursLoaded),
        filter(toursLoaded => toursLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.tours$ = this.store.select(getAllTours);
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
