import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { reviewActionTypes, reviewsLoaded } from '../actions/reviews.actions';
import { IReviews } from 'src/app/models/reviews.interface';

export interface ReviewState extends EntityState<IReviews> {
    reviewsLoaded: boolean;
}

export const adapter: EntityAdapter<IReviews> = createEntityAdapter<IReviews>();

export const initialState = adapter.getInitialState({
    reviewsLoaded: false
});

export const reviewReducer = createReducer(
    initialState,

    on(reviewActionTypes.reviewsLoaded, (state, action) => {
        return adapter.setAll(
            action.reviews,
            { ...state, reviewsLoaded: true }
        );
    }),

    on(reviewActionTypes.createReview, (state, action) => {
        return adapter.addOne(action.review, state);
    }),

    on(reviewActionTypes.deleteReview, (state, action) => {
        return adapter.removeOne(action.reviewId, state);
    }),

    on(reviewActionTypes.updateReview, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
