import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddGlobalError } from 'src/app/store/global.actions';
import { AppState } from 'src/app/store/reducers';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private noti: NotificationService,
        private store: Store<AppState>
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.noti.showError(error.error.error, 'Lỗi !!!')
                    this.store.dispatch(new AddGlobalError(error));
                    return throwError(error);
                })
            );
    }
}