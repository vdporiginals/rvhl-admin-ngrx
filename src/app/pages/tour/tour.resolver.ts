

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadTours } from 'src/app/store/actions/tour.actions';
import { AppState } from 'src/app/store/reducers';
import { areToursLoaded } from 'src/app/store/selectors/tour.selectors';

@Injectable()
export class TourResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areToursLoaded),
                tap((toursLoaded) => {
                    if (!toursLoaded) {
                        this.store.dispatch(loadTours({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(toursLoaded => toursLoaded),
                first()
            );
    }
}