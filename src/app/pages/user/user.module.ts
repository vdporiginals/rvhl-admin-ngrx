
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { StoreModule } from '@ngrx/store';
import { userReducer } from 'src/app/store/reducers/user.reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from 'src/app/store/effects/user.effects';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserAuthorizeComponent } from './user-authorize/user-authorize.component';

const routes: Routes = [
    {
        path: '',
        data: {},
        children: [
            {
                path: '',
                component: UserListComponent,
                pathMatch: 'full',
                resolve: {
                    users: UserResolver
                },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: UserDetailComponent,
                data: {
                    breadcrumb: '',
                },
            },
        ]
    }
];
@NgModule({
    declarations: [UserListComponent, UserDetailComponent, UserAuthorizeComponent],
    imports: [
        CommonModule,
        NzTableModule,
        NzSelectModule,
        FormsModule,
        NzModalModule,
        IconsProviderModule,
        SharedModule,
        NzCheckboxModule,
        NzSwitchModule,
        NzTimePickerModule,
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
        StoreModule.forFeature('users', userReducer),
        EffectsModule.forFeature([UserEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [UserService, UserResolver],
})
export class UserModule { }
