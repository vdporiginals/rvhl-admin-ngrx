
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EntertainListComponent } from './entertain-list/entertain-list.component';
import { EntertainDetailComponent } from './entertain-detail/entertain-detail.component';
import { EntertainService } from './entertain.service';
import { EntertainResolver } from './entertain.resolver';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { StoreModule } from '@ngrx/store';
import { entertainReducer } from 'src/app/store/reducers/entertain.reducers';
import { EffectsModule } from '@ngrx/effects';
import { EntertainEffects } from 'src/app/store/effects/entertain.effects';

const routes: Routes = [
    {
        path: '',
        // component: EntertainComponent,
        data: {},
        children: [
            {
                path: '',
                component: EntertainListComponent,
                pathMatch: 'full',
                resolve: {
                    entertains: EntertainResolver
                },
            },
            {
                path: ':id',
                pathMatch: 'full',
                component: EntertainDetailComponent,
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
    declarations: [EntertainListComponent, EntertainDetailComponent],
    imports: [
        CommonModule,
        NzTableModule,
        NzSelectModule,
        FormsModule,
        IconsProviderModule,
        SharedModule,
        NzCheckboxModule,
        NzSwitchModule,
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
        StoreModule.forFeature('entertains', entertainReducer),
        EffectsModule.forFeature([EntertainEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [EntertainService, EntertainResolver],
})
export class EntertainModule { }
