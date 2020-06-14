
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferDetailComponent } from './transfer-detail/transfer-detail.component';

const routes: Routes = [
    {
        path: '',
        // component: TransferComponent,
        data: {},
        children: [
            {
                path: '',
                component: TransferListComponent,
                pathMatch: 'full',
                // resolve: {
                //     userCategory: UserResolve
                // },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: TransferDetailComponent,
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
    declarations: [TransferListComponent, TransferDetailComponent],
    imports: [
        CommonModule,
        NzTableModule,
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
})
export class TransferModule { }
