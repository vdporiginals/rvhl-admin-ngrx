
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CuisineListComponent } from './cuisine-list/cuisine-list.component';
import { CuisineDetailComponent } from './cuisine-detail/cuisine-detail.component';
import { CuisineService } from './cuisine.service';
import { CuisineResolver } from './cuisine.resolver';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CuisineEffects } from 'src/app/store/effects/cuisine.effects';
import { cuisineReducer } from 'src/app/store/reducers/cuisine.reducers';

const routes: Routes = [
    {
        path: '',
        // component: CuisineComponent,
        data: {},
        children: [
            {
                path: '',
                component: CuisineListComponent,
                pathMatch: 'full',
                resolve: {
                    cuisines: CuisineResolver
                },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: CuisineDetailComponent,
                data: {
                    breadcrumb: '',
                },
                // resolve: {
                //     userpost: UserPostResolve
                // },
            },
        ]
    }
];
@NgModule({
    declarations: [CuisineListComponent, CuisineDetailComponent],
    imports: [
        CommonModule,
        NzTableModule,
        NzSelectModule,
        FormsModule,
        IconsProviderModule,
        SharedModule,
        NzCheckboxModule,
        NzSwitchModule,
        NzFormModule,
        FormsModule,
        ReactiveFormsModule,
        AngularEditorModule,
        NzTagModule,
        NzGridModule,
        NzInputModule,
        NzDrawerModule,
        NzDropDownModule,
        NzPageHeaderModule,
        StoreModule.forFeature('cuisines', cuisineReducer),
        EffectsModule.forFeature([CuisineEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [CuisineService, CuisineResolver],
})
export class CuisineModule { }
