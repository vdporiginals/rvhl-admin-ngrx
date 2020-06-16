

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadCuisines } from 'src/app/store/actions/cuisine.actions';
import { AppState } from 'src/app/store/reducers';
import { areCuisinesLoaded } from 'src/app/store/selectors/cuisine.selectors';

@Injectable()
export class CuisineResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areCuisinesLoaded),
                tap((cuisinesLoaded) => {
                    if (!cuisinesLoaded) {
                        this.store.dispatch(loadCuisines({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(cuisinesLoaded => cuisinesLoaded),
                first()
            );
    }
}