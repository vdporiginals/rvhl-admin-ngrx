import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { IAdvertise } from 'src/app/models/advertise.interface';

@Injectable()
export class AdvertiseService {
    apiurl = `${environment.apiUrl}`;
    // apiName = 'blogs'
    constructor(private http: HttpClient) { }

    getDatas(apiName, params?): Observable<IAdvertise[]> {
        return this.http.get<IAdvertise[]>(`${this.apiurl}/${apiName}`, {
            params,
        });
        // .pipe(
        //     map((res: any) => res)
        // );
    }

    getData(apiName, id): Observable<IAdvertise> {
        return this.http.get<IAdvertise>(`${this.apiurl}/${apiName}/${id}`).pipe(
            map((res: any) => res)
        );
    }

    create(apiName, data: IAdvertise): Observable<IAdvertise> {
        return this.http.post<IAdvertise>(`${this.apiurl}/${apiName}`, data);
    }

    update(apiName, id, data: Partial<IAdvertise>): Observable<any> {
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
