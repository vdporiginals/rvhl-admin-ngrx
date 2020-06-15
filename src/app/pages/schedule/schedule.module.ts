
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
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { ScheduleService } from './schedule.service';
import { StoreModule } from '@ngrx/store';
import { NzFormModule } from 'ng-zorro-antd/form';
import { scheduleReducer } from 'src/app/store/reducers/schedule.reducers';
import { EffectsModule } from '@ngrx/effects';
import { ScheduleEffects } from 'src/app/store/effects/schedule.effects';
import { ScheduleResolver } from './schedule.resolver';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
    {
        path: '',
        data: {},
        children: [
            {
                path: '',
                component: ScheduleListComponent,
                pathMatch: 'full',
                resolve: {
                    schedules: ScheduleResolver
                }
                // resolve: {
                //     userCategory: UserResolve
                // },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: ScheduleDetailComponent,
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
    declarations: [ScheduleListComponent, ScheduleDetailComponent],
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
        StoreModule.forFeature('schedules', scheduleReducer),
        EffectsModule.forFeature([ScheduleEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [ScheduleService, ScheduleResolver],
})
export class ScheduleModule { }
