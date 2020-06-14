
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
    {
        path: '',
        data: {},
        children: [
            {
                path: '',
                component: UserListComponent,
                pathMatch: 'full',
                // resolve: {
                //     userCategory: UserResolve
                // },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: UserDetailComponent,
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
    declarations: [UserListComponent, UserDetailComponent],
    imports: [
        CommonModule,
        NzTableModule,
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
})
export class UserModule { }
