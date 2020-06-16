

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadAdvertises } from 'src/app/store/actions/advertise.actions';
import { AppState } from 'src/app/store/reducers';
import { areAdvertisesLoaded } from 'src/app/store/selectors/advertise.selectors';

@Injectable()
export class AdvertiseResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areAdvertisesLoaded),
                tap((advertisesLoaded) => {
                    if (!advertisesLoaded) {
                        this.store.dispatch(loadAdvertises({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(advertisesLoaded => advertisesLoaded),
                first()
            );
    }
}