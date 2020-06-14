
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

const routes: Routes = [
    {
        path: '',
        data: {},
        children: [
            {
                path: '',
                component: ScheduleListComponent,
                pathMatch: 'full',
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

        NzPageHeaderModule,
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
})
export class ScheduleModule { }
