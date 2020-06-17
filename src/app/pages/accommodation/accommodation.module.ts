
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { AccommodationDetailComponent } from './accommodation-detail/accommodation-detail.component';
import { accommodationReducer } from 'src/app/store/reducers/accommodation.reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AccommodationEffects } from 'src/app/store/effects/accommodation.effects';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccommodationResolver } from './accomodation.resolver';
import { AccommodationService } from './accommodation.service';

const routes: Routes = [
    {
        path: '',
        // component: AccommodationComponent,
        data: {},
        children: [
            {
                path: 'hotel',
                component: AccommodationListComponent,
                pathMatch: 'full',
                data: {
                    breadcrumb: 'Khách sạn',
                    apiName: 'hotel'
                },
                resolve: {
                    accomodations: AccommodationResolver
                },
            },
            {
                path: 'homestay',
                pathMatch: 'full',
                component: AccommodationListComponent,
                data: {
                    breadcrumb: 'Homestay',
                    apiName: 'homestay'
                },
                resolve: {
                    accomodations: AccommodationResolver
                },
            },
            {
                path: 'villa',
                pathMatch: 'full',
                component: AccommodationListComponent,
                data: {
                    breadcrumb: 'Villa',
                    apiName: 'villa'
                },
                resolve: {
                    accomodations: AccommodationResolver
                },
            },
        ]
    }
];
@NgModule({
    declarations: [AccommodationListComponent, AccommodationDetailComponent],
    imports: [
        CommonModule,
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
        StoreModule.forFeature('accommodations', accommodationReducer),
        EffectsModule.forFeature([AccommodationEffects]),
        NzTagModule,
        NzDropDownModule,
        NzTableModule,
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [AccommodationResolver, AccommodationService],
})
export class AccommodationModule { }
