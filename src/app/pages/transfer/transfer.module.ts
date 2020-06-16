
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferDetailComponent } from './transfer-detail/transfer-detail.component';
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
import { EffectsModule } from '@ngrx/effects';
import { TransferService } from './transfer.service';
import { TransferResolver } from './transfer.resolver';
import { transferReducer } from 'src/app/store/reducers/transfer.reducers';
import { TransferEffects } from 'src/app/store/effects/transfer.effects';

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
        StoreModule.forFeature('transfers', transferReducer),
        EffectsModule.forFeature([TransferEffects]),
        NzButtonModule,
        RouterModule.forChild(routes)
    ],
    providers: [TransferService, TransferResolver],
})
export class TransferModule { }
