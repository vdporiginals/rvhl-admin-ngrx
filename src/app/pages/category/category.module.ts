import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { StoreModule } from '@ngrx/store';
import { categoryReducer } from 'src/app/store/reducers/category.reducers';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from 'src/app/store/effects/category.effects';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryService } from './category.service';
@NgModule({
  declarations: [CategoryListComponent, CategoryDetailComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    NzCheckboxModule,
    NzTabsModule,
    NzFormModule,
    IconsProviderModule,
    NzPageHeaderModule,
    SharedModule,
    NzSwitchModule,
    AngularEditorModule,
    StoreModule.forFeature('categories', categoryReducer),
    EffectsModule.forFeature([CategoryEffects]),
    NzTagModule,
    NzDropDownModule,
    NzTableModule,
    NzButtonModule,
  ],
  providers: [CategoryService]
})
export class CategoryModule { }
