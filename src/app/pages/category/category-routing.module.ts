import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryResolver } from './category.resolver';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'advertise'
    },
    {
        path: 'accommodation',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Chỗ ở',
            routeName: 'estates/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'advertise',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Quảng cáo',
            routeName: 'advertises/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'cuisine',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Ẩm thực',
            routeName: 'restaurants/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'entertain',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Giải trí',
            routeName: 'entertains/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'review',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Review',
            routeName: 'reviews/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'schedule',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Lịch trình',
            routeName: 'blogs/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'tour',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Tour',
            routeName: 'tours/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
    {
        path: 'transfer',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Vận chuyển',
            routeName: 'transfers/category'
        },
        resolve: {
            categories: CategoryResolver
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CategoryResolver]
})
export class CategoryRoutingModule { }
