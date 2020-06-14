
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CuisineListComponent } from './cuisine-list/cuisine-list.component';
import { CuisineDetailComponent } from './cuisine-detail/cuisine-detail.component';

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
                // resolve: {
                //     userCategory: UserResolve
                // },
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
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
})
export class CuisineModule { }
