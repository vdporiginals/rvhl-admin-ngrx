
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DashboardComponent } from './dashboard.component';
const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: {},
        // children: [
        //     {
        //         path: '',
        //         component: ScheduleListComponent,
        //         pathMatch: 'full',
        //         // resolve: {
        //         //     userCategory: UserResolve
        //         // },
        //     },

        // ]
    }
];
@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        NzTableModule,
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
})
export class DashboardModule { }
