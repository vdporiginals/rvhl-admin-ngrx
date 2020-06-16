

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadReviews } from 'src/app/store/actions/reviews.actions';
import { AppState } from 'src/app/store/reducers';
import { areReviewsLoaded } from 'src/app/store/selectors/reviews.selectors';

@Injectable()
export class ReviewsResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areReviewsLoaded),
                tap((reviewsLoaded) => {
                    if (!reviewsLoaded) {
                        this.store.dispatch(loadReviews({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(reviewsLoaded => reviewsLoaded),
                first()
            );
    }
}