import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ICategory } from 'src/app/models/category.interface';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class CategoryService {
    apiurl = `${environment.apiUrl}`;
    // apiName = 'blogs'
    constructor(private http: HttpClient) { }

    getDatas(apiName, params?): Observable<ICategory[]> {
        return this.http.get<ICategory[]>(`${this.apiurl}/${apiName}`, {
            params,
        });
        // .pipe(
        //     map((res: any) => res)
        // );
    }

    getData(apiName, id): Observable<ICategory> {
        return this.http.get<ICategory>(`${this.apiurl}/${apiName}/${id}`).pipe(
            map((res: any) => res)
        );
    }

    create(apiName, data: ICategory): Observable<ICategory> {
        return this.http.post<ICategory>(`${this.apiurl}/${apiName}`, data);
    }

    update(apiName, id, data: Partial<ICategory>): Observable<any> {
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
