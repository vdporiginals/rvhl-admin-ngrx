
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EntertainListComponent } from './entertain-list/entertain-list.component';
import { EntertainDetailComponent } from './entertain-detail/entertain-detail.component';
import { EntertainService } from './entertain.service';
import { EntertainResolver } from './entertain.resolver';

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
