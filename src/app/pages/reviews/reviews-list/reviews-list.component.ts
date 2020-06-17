import { Component, OnInit } from '@angular/core';
import { IReviews } from 'src/app/models/reviews.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllReviews, areReviewsLoaded } from 'src/app/store/selectors/reviews.selectors';
import { reviewActionTypes } from 'src/app/store/actions/reviews.actions';
import { filter, first } from 'rxjs/operators';
import { ReviewsDetailComponent } from '../reviews-detail/reviews-detail.component';
import { ReviewsService } from '../reviews.service';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {
  total = 1;
  listReview: IReviews[] = [];
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

  reviews$: Observable<IReviews[]>;

  reviewToBeUpdated: IReviews;

  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(private reviewService: ReviewsService, private drawerService: NzDrawerService, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.reviews$ = this.store.select(getAllReviews);
  }

  deleteReview(id: string) {
    this.store.dispatch(reviewActionTypes.deleteReview({ reviewId: id }));
  }
  showCreateForm() {
    const drawerRef = this.drawerService.create<ReviewsDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Lịch Trình',
      nzContent: ReviewsDetailComponent,
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
      this.reviews$ = this.store.select(getAllReviews);
    });
  }

  showUpdateForm(review: IReviews) {
    this.reviewToBeUpdated = { ...review };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<ReviewsDetailComponent>({
      nzTitle: 'Cập nhật Lịch Trình',
      nzContent: ReviewsDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.reviewToBeUpdated
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.reviews$ = this.store.select(getAllReviews);
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

    this.store.dispatch(reviewActionTypes.loadReviews({ params }));

    this.store
      .pipe(
        select(areReviewsLoaded),
        filter(reviewsLoaded => reviewsLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.reviews$ = this.store.select(getAllReviews);
  }

  changeStatus(val: boolean, id) {
    this.loading = true;
    const params = {
      status: !val,
    }

    this.store.dispatch(reviewActionTypes.updateReview({
      update: {
        id,
        changes: params
      }
    }));

    this.store
      .pipe(
        select(areReviewsLoaded),
        filter(reviewsLoaded => reviewsLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.reviews$ = this.store.select(getAllReviews);
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
