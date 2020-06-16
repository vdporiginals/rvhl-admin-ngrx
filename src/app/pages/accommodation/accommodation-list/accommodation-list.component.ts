import { Component, OnInit } from '@angular/core';
import { IAccommodation } from 'src/app/models/accommodation.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { AccommodationService } from '../accommodation.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllAccommodations, areAccommodationsLoaded } from 'src/app/store/selectors/accommodation.selectors';
import { accommodationActionTypes } from 'src/app/store/actions/accommodation.actions';
import { AccommodationDetailComponent } from '../accommodation-detail/accommodation-detail.component';
import { filter, first } from 'rxjs/operators';
import { Event, Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.scss']
})
export class AccommodationListComponent implements OnInit {
  total = 1;
  listAccommodation: IAccommodation[] = [];
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

  accommodations$: Observable<IAccommodation[]>;

  accommodationToBeUpdated: IAccommodation;
  routePathName: string;
  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(
    private accommodationService: AccommodationService,
    private route: ActivatedRoute, private router: Router,
    private drawerService: NzDrawerService, private store: Store<AppState>) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const params = this.route.snapshot.params;
        const path = this.route.snapshot.url[0].path;
        if (path === 'hotel' && Object.keys(params).length === 0) {
          this.routePathName = 'hotel';
        } else if (path === 'homestay' && Object.keys(params).length === 0) {
          this.routePathName = 'homestay';
        } else if (path === 'villa' && Object.keys(params).length === 0) {
          this.routePathName = 'villa';
        } else {

        }
      }
    });
  }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.accommodations$ = this.store.select(getAllAccommodations);
  }

  deleteAccommodation(id: string) {
    this.store.dispatch(accommodationActionTypes.deleteAccommodation({ apiName: this.routePathName, accommodationId: id }));
  }

  showCreateForm() {
    const drawerRef = this.drawerService.create<AccommodationDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Lịch Trình',
      nzContent: AccommodationDetailComponent,
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
      this.accommodations$ = this.store.select(getAllAccommodations);
    });
  }

  showUpdateForm(accommodation: IAccommodation) {
    this.accommodationToBeUpdated = { ...accommodation };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<AccommodationDetailComponent>({
      nzTitle: 'Cập nhật Lịch Trình',
      nzContent: AccommodationDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.accommodationToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.accommodations$ = this.store.select(getAllAccommodations);
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

    this.store.dispatch(accommodationActionTypes.loadAccommodations({ apiName: this.routePathName, params }));

    this.store
      .pipe(
        select(areAccommodationsLoaded),
        filter(accommodationsLoaded => accommodationsLoaded.accommodationsLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.accommodations$ = this.store.select(getAllAccommodations);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(accommodationActionTypes.updateAccommodation({
      apiName: this.routePathName,
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areAccommodationsLoaded),
        filter(accommodationsLoaded => accommodationsLoaded.accommodationsLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.accommodations$ = this.store.select(getAllAccommodations);
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
