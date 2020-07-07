
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IReviews } from 'src/app/models/reviews.interface';


export const loadReviews = createAction(
    '[Reviews List] Load Reviews via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const reviewsLoaded = createAction(
    '[Reviews Effect] Reviews Loaded Successfully',
    props<{
        reviews: IReviews[], pageNum: number,
        count: number
    }>()
);

// export const ReviewLoaded = createAction(
//     '[Review Effect] Review Loaded Successfully',
//     props<{ Review: IReviews }>()
// );

export const createReview = createAction(
    '[Create Review Component] Create Review',
    props<{ review: IReviews }>()
);

export const deleteReview = createAction(
    '[Reviews List Operations] Delete Review',
    props<{ reviewId: string }>()
);

export const updateReview = createAction(
    '[Reviews List Operations] Update Review',
    props<{ update: Update<IReviews> }>()
);

export const reviewActionTypes = {
    loadReviews,
    reviewsLoaded,
    createReview,
    deleteReview,
    updateReview
};
