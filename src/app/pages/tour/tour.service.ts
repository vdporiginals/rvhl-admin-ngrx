import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { ITour } from 'src/app/models/tour.interface';

@Injectable()
export class TourService {
    apiurl = `${environment.apiUrl}`;
    // apiName = 'blogs'
    constructor(private http: HttpClient) { }

    getDatas(apiName, params?): Observable<ITour[]> {
        return this.http.get<ITour[]>(`${this.apiurl}/${apiName}`, {
            params,
        });
        // .pipe(
        //     map((res: any) => res)
        // );
    }

    getData(apiName, id): Observable<ITour> {
        return this.http.get<ITour>(`${this.apiurl}/${apiName}/${id}`).pipe(
            map((res: any) => res)
        );
    }

    create(apiName, data: ITour): Observable<ITour> {
        return this.http.post<ITour>(`${this.apiurl}/${apiName}`, data);
    }

    update(apiName, id, data: Partial<ITour>): Observable<any> {
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
