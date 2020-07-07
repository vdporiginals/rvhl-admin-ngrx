import { Component, OnInit } from '@angular/core';
import { ITransfer } from 'src/app/models/transfer.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { TransferService } from '../transfer.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllTransfers, areTransfersLoaded, getPagination } from 'src/app/store/selectors/transfer.selectors';
import { transferActionTypes, loadTransfers } from 'src/app/store/actions/transfer.actions';
import { TransferDetailComponent } from '../transfer-detail/transfer-detail.component';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  total = 1;
  listTransfer: ITransfer[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  pagination$: Observable<any>;
  filterName = '';
  filterStatus = [
    { text: 'Kích hoạt', value: 'true' },
    { text: 'Chưa kích hoạt', value: 'false' }
  ];
  size: NzButtonSize = 'default';
  isFilter: boolean;

  visible = false;

  transfers$: Observable<ITransfer[]>;

  transferToBeUpdated: ITransfer;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private transferService: TransferService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.transfers$ = this.store.select(getAllTransfers);
    this.pagination$ = this.store.select(getPagination);
    this.pagination$.subscribe(res => {
      this.pageIndex = res.pageNum;
      this.total = res.count;
    });
  }

  deleteTransfer(id: string) {
    this.store.dispatch(transferActionTypes.deleteTransfer({ transferId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<TransferDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Vận chuyển',
      nzContent: TransferDetailComponent,
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
      this.transfers$ = this.store.select(getAllTransfers);
      this.store.dispatch(loadTransfers({
        params: {
          limit: 10,
          page: 1
        }
      }));
    });
  }

  showUpdateForm(transfer: ITransfer) {
    this.transferToBeUpdated = { ...transfer };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<TransferDetailComponent>({
      nzTitle: 'Cập nhật Vận chuyển',
      nzContent: TransferDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.transferToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.transfers$ = this.store.select(getAllTransfers);
      this.store.dispatch(loadTransfers({
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

    this.store.dispatch(transferActionTypes.loadTransfers({ params }));

    this.store
      .pipe(
        select(areTransfersLoaded),
        filter(transfersLoaded => transfersLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.transfers$ = this.store.select(getAllTransfers);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    };

    this.store.dispatch(transferActionTypes.updateTransfer({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areTransfersLoaded),
        filter(transfersLoaded => transfersLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.transfers$ = this.store.select(getAllTransfers);
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
    console.log(pageIndex)

    if (currentSort !== undefined || this.isFilter === true) {
      this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
    } else {
      this.loadDataFromServer(pageIndex, pageSize, null, null, [])
    }
  }
}
