
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReviewsListComponent } from './reviews-list/reviews-list.component';
import { ReviewsDetailComponent } from './reviews-detail/reviews-detail.component';
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
import { reviewReducer } from 'src/app/store/reducers/reviews.reducers';
import { EffectsModule } from '@ngrx/effects';
import { ReviewEffects } from 'src/app/store/effects/reviews.effects';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';

const routes: Routes = [
    {
        path: '',
        // component: ReviewsComponent,
        data: {},
        children: [
            {
                path: '',
                component: ReviewsListComponent,
                pathMatch: 'full',
                resolve: {
                    reviews: ReviewsResolver
                },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: ReviewsDetailComponent,
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
    declarations: [ReviewsListComponent, ReviewsDetailComponent],
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
        StoreModule.forFeature('reviews', reviewReducer),
        EffectsModule.forFeature([ReviewEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [ReviewsService, ReviewsResolver],
})
export class ReviewsModule { }
