

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadEntertains } from 'src/app/store/actions/entertain.actions';
import { AppState } from 'src/app/store/reducers';
import { areEntertainsLoaded } from 'src/app/store/selectors/entertain.selectors';

@Injectable()
export class EntertainResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areEntertainsLoaded),
                tap((entertainsLoaded) => {
                    if (!entertainsLoaded) {
                        this.store.dispatch(loadEntertains({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(entertainsLoaded => entertainsLoaded),
                first()
            );
    }
}