import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editConf } from 'src/app/shared/editorconfig';
import { Subscription, Observable } from 'rxjs';
import { ICategory } from 'src/app/models/category.interface';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/html-sanitize.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { areCategoriesLoaded } from 'src/app/store/selectors/category.selectors';
import { tap } from 'rxjs/operators';
import { categoryActionTypes } from 'src/app/store/actions/category.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  editorConfig: AngularEditorConfig = editConf;

  visible = false;
  childrenVisible = false;
  @Input() value;
  isCheckedButton = true;
  private storeSubcription: Subscription;

  categories$: Observable<ICategory[]>;
  routePathName: string;
  categoryToBeUpdated: ICategory;
  detailForm: FormGroup;
  isUpdateActivated = false;
  positionAccommodation = ['Hotel', 'Villa', 'Homestay']
  positionAdvertise = [
    { value: 'slider', name: 'Slider trang chủ' },
    { value: 'video', name: 'Video trang chủ' },
    { name: 'Quảng cáo trang chủ', value: 'HomepageAdvertise' },
    { name: 'Quảng cáo trang khác', value: 'AdvertisePage' }]
  constructor(
    private fb: FormBuilder,
    // private http: HttpClient,
    // private drawerService: NzDrawerService,
    // private sharedData: SharedDataService,
    // private sanitize: SanitizeHtmlPipe,
    // private route: ActivatedRoute, private router: Router,
    private store: Store<AppState>,
    private drawerRef: NzDrawerRef<any>) {
    this.storeSubcription = this.store
      .pipe(
        select(areCategoriesLoaded),
        tap((categoriesLoaded) => {
          const path = categoriesLoaded.routeName;
          this.routePathName = path;
        })).subscribe();

    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      keywords: [''],
      position: ['']
    });
  }

  get getImages() { return this.detailForm.get('images') as FormArray; }
  ngOnInit(): void {
    if (this.value !== undefined) {
      this.categoryToBeUpdated = this.value;
      this.visible = true;

      this.detailForm.get('name').setValue(this.value.name);
      this.detailForm.get('description').setValue(this.value.description);
      this.detailForm.get('keywords').setValue(this.value.keywords);
      if (this.routePathName === 'estates/category' || this.routePathName === 'advertises/category') {
        this.detailForm.get('position').setValue(this.value.position);
      }

    }
  }

  ngOnDestroy() {
    this.storeSubcription.unsubscribe();
  }
  close(): void {
    this.drawerRef.close();
  }

  createOrUpdate() {
    if (!this.value) {
      this.store.dispatch(categoryActionTypes.createCategory({ routeName: this.routePathName, category: this.detailForm.value }));
      this.isUpdateActivated = false;
      this.drawerRef.close();
    } else {
      this.updateCategory(this.detailForm.value);
    }
  }

  updateCategory(updateForm) {
    const update: Update<ICategory> = {
      id: this.categoryToBeUpdated._id,
      changes: {
        ...this.categoryToBeUpdated,
        ...updateForm
      }
    };

    this.store.dispatch(categoryActionTypes.updateCategory({ routeName: this.routePathName, update }));

    this.isUpdateActivated = false;
    this.categoryToBeUpdated = null;

    this.drawerRef.close(this.categoryToBeUpdated);
  }

  chooseImageArray() {
  }
}
