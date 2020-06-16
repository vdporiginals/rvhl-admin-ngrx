

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadAccommodations } from 'src/app/store/actions/accommodation.actions';
import { AppState } from 'src/app/store/reducers';
import { areAccommodationsLoaded } from 'src/app/store/selectors/accommodation.selectors';

@Injectable()
export class AccommodationResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const apiName = route.data.apiName;
        return this.store
            .pipe(
                select(areAccommodationsLoaded),
                tap((accommodationsLoaded) => {
                    if (apiName !== accommodationsLoaded.apiName) {
                        this.store.dispatch(loadAccommodations({
                            apiName,
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    } else if (!accommodationsLoaded.accommodationsLoaded && accommodationsLoaded.apiName === '') {
                        this.store.dispatch(loadAccommodations({
                            apiName,
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }



                    // if (!accommodationsLoaded.accommodationsLoaded && accommodationsLoaded.apiName === '') {
                    //     this.store.dispatch(loadAccommodations({
                    //         apiName,
                    //         params: {
                    //             limit: 10,
                    //             page: 1
                    //         }
                    //     }));
                    // }
                }),
                filter(accommodationsLoaded => accommodationsLoaded.accommodationsLoaded),
                first()
            );
    }
}
