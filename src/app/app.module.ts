import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AppRoutingModule } from './app-routing.module';
// import { JwtModule } from "@auth0/angular-jwt";
import { IconsProviderModule } from './icons-provider.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from './shared/shared.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';

import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error-handling.interceptor';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { UserComponent } from './component/user/user.component';
import { UpdateProfileComponent } from './component/update-profile/update-profile.component';

registerLocaleData(vi);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    UpdateProfileComponent
  ],
  imports: [
    SharedModule,
    NzModalModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzDrawerModule,
    NzAvatarModule,
    NzDropDownModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzBreadCrumbModule,
    FormsModule,
    ReactiveFormsModule,
    NzMenuModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        // strictStateImmutability: true,
        // strictActionImmutability: true,
        strictStateImmutability: false,
        strictActionImmutability: false,
        // disabled until https://github.com/ngrx/platform/issues/2109 is resolved
        /* strictActionImmutability: true, */
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: vi_VN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
