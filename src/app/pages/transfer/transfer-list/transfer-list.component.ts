import { Component, OnInit } from '@angular/core';
import { ITransfer } from 'src/app/models/transfer.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  total = 1;
  listSchedule: ISchedule[] = [];
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

  schedules$: Observable<ISchedule[]>;

  scheduleToBeUpdated: ISchedule;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private scheduleService: ScheduleService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.schedules$ = this.store.select(getAllSchedules);
  }

  deleteSchedule(id: string) {
    this.store.dispatch(scheduleActionTypes.deleteSchedule({ scheduleId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<ScheduleDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Lịch Trình',
      nzContent: ScheduleDetailComponent,
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
      this.schedules$ = this.store.select(getAllSchedules);
    });
  }

  showUpdateForm(schedule: ISchedule) {
    this.scheduleToBeUpdated = { ...schedule };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<ScheduleDetailComponent>({
      nzTitle: 'Cập nhật Lịch Trình',
      nzContent: ScheduleDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.scheduleToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.schedules$ = this.store.select(getAllSchedules);
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

    this.store.dispatch(scheduleActionTypes.loadSchedules({ params }));

    this.store
      .pipe(
        select(areSchedulesLoaded),
        filter(schedulesLoaded => schedulesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.schedules$ = this.store.select(getAllSchedules);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(scheduleActionTypes.updateSchedule({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areSchedulesLoaded),
        filter(schedulesLoaded => schedulesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.schedules$ = this.store.select(getAllSchedules);
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
