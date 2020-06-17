import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './shared/guard/admin.guard';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './shared/guard/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Danh mục'
    }
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Người dùng'
    }
  },
  {
    path: 'schedules',
    loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Lịch trình',
      count: ''
    }
  },
  {
    path: 'transfers',

    loadChildren: () => import('./pages/transfer/transfer.module').then(m => m.TransferModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Vận chuyển',
      count: ''
    }
  },
  {
    path: 'advertises',
    loadChildren: () => import('./pages/advertise/advertise.module').then(m => m.AdvertiseModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Quảng cáo',
      count: ''
    }
  },
  {
    path: 'tours',
    loadChildren: () => import('./pages/tour/tour.module').then(m => m.TourModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Tour',
      count: ''
    }
  },
  {
    path: 'accommodations',
    loadChildren: () => import('./pages/accommodation/accommodation.module').then(m => m.AccommodationModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Chỗ ở',
      count: ''
    }
  },
  {
    path: 'entertains',
    loadChildren: () => import('./pages/entertain/entertain.module').then(m => m.EntertainModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Giải trí',
      count: ''
    }
  },
  {
    path: 'reviews',
    loadChildren: () => import('./pages/reviews/reviews.module').then(m => m.ReviewsModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Reviews',
      count: ''
    }
  },
  {
    path: 'cuisine',
    loadChildren: () => import('./pages/cuisine/cuisine.module').then(m => m.CuisineModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Ẩm thực',
      count: ''
    }
  },
  {
    path: 'images',
    loadChildren: () => import('./pages/image/image.module').then(m => m.ImageModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Hình ảnh',
      count: ''
    }
  },
  {
    path: 'customer-request',
    loadChildren: () => import('./pages/customer-request/customer-request.module').then(m => m.CustomerRequestModule),
    canActivate: [AdminGuard],
    data: {
      breadcrumb: 'Yêu cầu khách hàng',
      count: ''
    }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
