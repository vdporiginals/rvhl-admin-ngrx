import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedDataService } from './shared-data.service';
@Injectable({
    providedIn: 'root'
})

export class AuthService {
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(
        // private noti: NotificationService,
        private http: HttpClient,
        private sharedData: SharedDataService,
        public router: Router
    ) { }

    // Sign-up
    signUp(user: any): Observable<any> {
        const api = `${environment.apiUrl}/auth/register`;
        return this.http.post(api, user)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Sign-in
    signIn(user: any) {
        const promise = new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}/auth/login`, user).toPromise().then((res: any) => {
                // Success
                console.log(res)
                localStorage.setItem('rvhl_token', JSON.stringify({ token: res.token, user: res.user }));
                if (localStorage.getItem('rvhl_token') !== null) {
                    this.sharedData.setLogged(true);
                }
                resolve();
            },
                err => {
                    // Error
                    reject(err);
                }
            );
        });
        return promise;
    }

    getUserToken() {
        return localStorage.getItem('rvhl_token');
    }

    public get isLoggedIn(): boolean {
        const authToken = JSON.parse(localStorage.getItem('rvhl_token'));
        const base64Url = authToken.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const exp = JSON.parse(jsonPayload).exp;
        return (authToken.token !== null && Date.now() <= exp * 1000) ? true : false;
    }

    doLogout() {
        const removeToken = localStorage.removeItem('rvhl_token');
        if (removeToken == null) {
            this.router.navigate(['/login']);
        }
    }

    // User profile
    getUserProfile(id): Observable<any> {
        const api = `${environment.apiUrl}/users/${id}`;
        return this.http.get(api, { headers: this.headers }).pipe(
            map((res: Response) => {
                return res || {};
            }),
            catchError(this.handleError)
        );
    }

    // Error
    handleError(error: HttpErrorResponse) {
        let msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(msg);
    }
}
