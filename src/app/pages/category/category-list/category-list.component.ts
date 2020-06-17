import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/models/category.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { Event, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { categoryActionTypes } from 'src/app/store/actions/category.actions';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';
import { areCategoriesLoaded, getAllCategories } from 'src/app/store/selectors/category.selectors';
import { filter, first } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  total = 1;
  listCategory: ICategory[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  // filterPosition = [
  //   { text: 'Kích hoạt', value: 'true' },
  //   { text: 'Chưa kích hoạt', value: 'false' }
  // ];
  filterName = '';
  size: NzButtonSize = 'default';
  isFilter: boolean;

  visible = false;

  categories$: Observable<ICategory[]>;

  categoryToBeUpdated: ICategory;
  routePathName: string;
  isUpdateActivated = false;
  private subcription: Subscription;

  constructor(
    private categorieservice: CategoryService,
    private route: ActivatedRoute, private router: Router,
    private drawerService: NzDrawerService, private store: Store<AppState>) {
    this.routePathName = this.route.snapshot.data.routeName;
  }

  ngOnInit(): void {
    // this.loadDataFromServer(1, 10, null, null, []);
    this.categories$ = this.store.select(getAllCategories);
  }

  deleteCategory(id: string) {
    this.store.dispatch(categoryActionTypes.deleteCategory({ routeName: this.routePathName, categoryId: id }));
  }

  showCreateForm() {
    const drawerRef = this.drawerService.create<CategoryDetailComponent, { value: any }, any>({
      nzTitle: 'Thêm Lịch Trình',
      nzContent: CategoryDetailComponent,
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
      this.categories$ = this.store.select(getAllCategories);
    });
  }

  showUpdateForm(category: ICategory) {
    this.categoryToBeUpdated = { ...category };
    this.isUpdateActivated = true;

    const drawerRef = this.drawerService.create<CategoryDetailComponent>({
      nzTitle: 'Cập nhật Lịch Trình',
      nzContent: CategoryDetailComponent,
      nzBodyStyle: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        'padding-bottom': '53px'
      },
      nzMaskClosable: true,
      nzWidth: 720,
      nzContentParams: {
        value: this.categoryToBeUpdated,
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      // console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      // console.log(data);
      this.categories$ = this.store.select(getAllCategories);
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

    this.store.dispatch(categoryActionTypes.loadCategories({ routeName: this.routePathName, params }));

    this.store
      .pipe(
        select(areCategoriesLoaded),
        filter(categoriesLoaded => categoriesLoaded.categoriesLoaded),
        first()
      ).subscribe(res => {
        this.loading = false;
      });

    this.visible = false;
    this.categories$ = this.store.select(getAllCategories);
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
