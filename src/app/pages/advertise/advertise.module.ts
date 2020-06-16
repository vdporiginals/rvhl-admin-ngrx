
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdvertiseListComponent } from './advertise-list/advertise-list.component';
import { AdvertiseDetailComponent } from './advertise-detail/advertise-detail.component';
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
import { advertiseReducer } from 'src/app/store/reducers/advertise.reducers';
import { EffectsModule } from '@ngrx/effects';
import { AdvertiseEffects } from 'src/app/store/effects/advertise.effects';
import { AdvertiseService } from './advertise.service';
import { AdvertiseResolver } from './advertise.resolver';

const routes: Routes = [
    {
        path: '',
        // component: AdvertiseComponent,
        data: {},
        children: [
            {
                path: '',
                component: AdvertiseListComponent,
                pathMatch: 'full',
                data: {
                    breadcrumb: '',
                },
                resolve: {
                    advertises: AdvertiseResolver
                },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: AdvertiseDetailComponent,
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
    declarations: [AdvertiseListComponent, AdvertiseDetailComponent],
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
        StoreModule.forFeature('advertises', advertiseReducer),
        EffectsModule.forFeature([AdvertiseEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [AdvertiseService, AdvertiseResolver],
})
export class AdvertiseModule { }
