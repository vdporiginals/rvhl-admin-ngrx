
import { NgModule } from '@angular/core';
import { OverflowPipe } from './pipe/overflow.pipe';
// import { OnlyNumberDirective } from './only-num.directive';
import { SanitizeHtmlPipe } from './pipe/html-sanitize.pipe';

@NgModule({
    declarations: [
        OverflowPipe,
        // OnlyNumberDirective,
        SanitizeHtmlPipe
    ],
    exports: [OverflowPipe, SanitizeHtmlPipe],
    providers: [OverflowPipe, SanitizeHtmlPipe]
})
export class SharedModule { }
