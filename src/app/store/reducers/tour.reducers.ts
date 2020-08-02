import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { tourActionTypes, toursLoaded } from '../actions/tour.actions';
import { ITour } from 'src/app/models/tour.interface';

export interface TourState extends EntityState<ITour> {
    count: number;
    pageNum: number;
    toursLoaded: boolean;
}

export const adapter: EntityAdapter<ITour> = createEntityAdapter<ITour>({
    selectId: tours => tours._id
});

export const initialState = adapter.getInitialState({
    pageNum: 0,
    count: 0,
    toursLoaded: false
});

export const tourReducer = createReducer(
    initialState,

    on(tourActionTypes.toursLoaded, (state, action) => {
        return adapter.setAll(
            action.tours,
            {
                ...state,
                pageNum: action.pageNum,
                count: action.count, toursLoaded: true
            }
        );
    }),

    on(tourActionTypes.createTour, (state, action) => {
        return adapter.addOne(action.tour, state);
    }),

    on(tourActionTypes.deleteTour, (state, action) => {
        return adapter.removeOne(action.tourId, state);
    }),

    on(tourActionTypes.updateTour, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
