
import { NgModule } from '@angular/core';
import { OverflowPipe } from './pipe/overflow.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
// import { OnlyNumberDirective } from './only-num.directive';
import { SanitizeHtmlPipe } from './pipe/html-sanitize.pipe';
import { ImageDrawerComponent } from './image-drawer/image-drawer.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { imageReducer } from '../store/reducers/image.reducers';
import { EffectsModule } from '@ngrx/effects';
import { ImageEffects } from '../store/effects/image.effects';

@NgModule({
    imports: [
        CommonModule,
        NzDrawerModule,
        NzMenuModule,
        NzCardModule,
        ScrollingModule,
        FormsModule,
        StoreModule.forFeature('images', imageReducer),
        EffectsModule.forFeature([ImageEffects]),
        ReactiveFormsModule,
    ],
    declarations: [
        OverflowPipe,
        // OnlyNumberDirective,
        SanitizeHtmlPipe,
        ImageDrawerComponent
    ],
    exports: [OverflowPipe, SanitizeHtmlPipe],
    providers: [OverflowPipe, SanitizeHtmlPipe]
})
export class SharedModule { }
