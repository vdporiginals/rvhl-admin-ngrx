import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { IEntertain } from 'src/app/models/entertain.interface';

@Injectable()
export class EntertainService {
    apiurl = `${environment.apiUrl}`;
    // apiName = 'blogs'
    constructor(private http: HttpClient) { }

    getDatas(apiName, params?): Observable<IEntertain[]> {
        return this.http.get<IEntertain[]>(`${this.apiurl}/${apiName}`, {
            params,
        });
        // .pipe(
        //     map((res: any) => res)
        // );
    }

    getData(apiName, id): Observable<IEntertain> {
        return this.http.get<IEntertain>(`${this.apiurl}/${apiName}/${id}`).pipe(
            map((res: any) => res)
        );
    }

    create(apiName, data: IEntertain): Observable<IEntertain> {
        return this.http.post<IEntertain>(`${this.apiurl}/${apiName}`, data);
    }

    update(apiName, id, data: Partial<IEntertain>): Observable<any> {
        return this.http.put(`${this.apiurl}/${apiName}/${id}`, data);
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
