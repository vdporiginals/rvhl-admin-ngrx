

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadCategories, categoriesLoaded } from 'src/app/store/actions/category.actions';
import { AppState } from 'src/app/store/reducers';
import { areCategoriesLoaded } from 'src/app/store/selectors/category.selectors';

@Injectable()
export class CategoryResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const routeName = route.data.routeName;
        return this.store
            .pipe(
                select(areCategoriesLoaded),
                tap((categories) => {
                    if (routeName !== categories.routeName) {
                        this.store.dispatch(loadCategories({
                            routeName,
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    } else if (!categories.categoriesLoaded && categories.routeName === '') {
                        this.store.dispatch(loadCategories({
                            routeName,
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }



                    // if (!categoriesLoaded.categoriesLoaded && categoriesLoaded.routeName === '') {
                    //     this.store.dispatch(loadCategories({
                    //         routeName,
                    //         params: {
                    //             limit: 10,
                    //             page: 1
                    //         }
                    //     }));
                    // }
                }),
                filter(categories => categories.categoriesLoaded),
                first()
            );
    }
}
