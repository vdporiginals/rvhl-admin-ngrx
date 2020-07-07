
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ITour } from 'src/app/models/tour.interface';


export const loadTours = createAction(
    '[Tours List] Load Tours via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const toursLoaded = createAction(
    '[Tours Effect] Tours Loaded Successfully',
    props<{
        tours: ITour[], pageNum: number,
        count: number
    }>()
);

// export const TourLoaded = createAction(
//     '[Tour Effect] Tour Loaded Successfully',
//     props<{ Tour: ITour }>()
// );

export const createTour = createAction(
    '[Create Tour Component] Create Tour',
    props<{ tour: ITour }>()
);

export const deleteTour = createAction(
    '[Tours List Operations] Delete Tour',
    props<{ tourId: string }>()
);

export const updateTour = createAction(
    '[Tours List Operations] Update Tour',
    props<{ update: Update<ITour> }>()
);

export const tourActionTypes = {
    loadTours,
    toursLoaded,
    createTour,
    deleteTour,
    updateTour
};
