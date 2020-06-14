
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdvertiseListComponent } from './advertise-list/advertise-list.component';
import { AdvertiseDetailComponent } from './advertise-detail/advertise-detail.component';

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
                // resolve: {
                //     userCategory: UserResolve
                // },
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
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
})
export class AdvertiseModule { }
