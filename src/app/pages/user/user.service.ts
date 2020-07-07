import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { IUser } from 'src/app/models/user.interface';
import { IAuthorize } from 'src/app/models/user-authorize.interface';
import { IRouteAccept } from 'src/app/models/route-accept.interface';

@Injectable()
export class UserService {
    apiurl = `${environment.apiUrl}`;
    // apiName = 'blogs'
    constructor(private http: HttpClient) { }

    getDatas(apiName, params?): Observable<IUser[]> {
        return this.http.get<IUser[]>(`${this.apiurl}/${apiName}`, {
            params,
        });
        // .pipe(
        //     map((res: any) => res)
        // );
    }

    getData(apiName, id): Observable<IUser> {
        return this.http.get<IUser>(`${this.apiurl}/${apiName}/${id}`).pipe(
            map((res: any) => res)
        );
    }

    create(apiName, data: IUser): Observable<IUser> {
        return this.http.post<IUser>(`${this.apiurl}/${apiName}`, data);
    }

    update(apiName, id, data: Partial<IUser>): Observable<any> {
        return this.http.put<any>(`${this.apiurl}/${apiName}/${id}`, data);
        // .pipe(
        //     catchError(this.handleError)
        // );
    }

    delete(apiName, id): Observable<any> {
        return this.http.delete(`${this.apiurl}/${apiName}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    setAuthorize(authorizeId, data: Partial<IAuthorize>): Observable<any> {
        return this.http.put<any>(`${this.apiurl}/web-config/authorize`, data,
            { params: { authorizeId } })
            .pipe(
                catchError(this.handleError)
            );
    }

    getAuthorize(id?): Observable<IAuthorize> {
        return this.http.get<IAuthorize>(`${this.apiurl}/web-config/authorize`, {
            params: {
                authorizeId: id
            }
        }).pipe(
            map((res: IAuthorize) => res)
        );
    }

    getRouteAccept(): Observable<IRouteAccept> {
        return this.http.get<IRouteAccept>(`${this.apiurl}/web-config/routes`).pipe(
            map((res: IRouteAccept) => res)
        );
    }

    handleError(error: HttpErrorResponse) {
        let msg = '';
        console.log(error.message);
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error}`;
        }
        return throwError(msg);
    }
}
