
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { reviewActionTypes } from '../actions/reviews.actions';
import { ReviewsService } from 'src/app/pages/reviews/reviews.service';

@Injectable()
export class ReviewEffects {

    loadReviews$ = createEffect(() =>
        this.actions$.pipe(
            ofType(reviewActionTypes.loadReviews),
            concatMap((actions) => this.reviewService.getDatas('user-reviews', actions.params)),
            map((reviews: any) => reviewActionTypes.reviewsLoaded({ reviews: reviews.data }))
        )
    );

    createReview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(reviewActionTypes.createReview),
            concatMap((action) => this.reviewService.create('user-reviews', action.review)),
            // tap(() => this.router.navigateByUrl('/reviews'))
        ),
        { dispatch: false }
    );

    deleteReview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(reviewActionTypes.deleteReview),
            concatMap((action) => this.reviewService.delete('user-reviews', action.reviewId))
        ),
        { dispatch: false }
    );

    updateReview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(reviewActionTypes.updateReview),
            concatMap((action) => this.reviewService.update('user-reviews', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private reviewService: ReviewsService, private actions$: Actions, private router: Router) { }
}
