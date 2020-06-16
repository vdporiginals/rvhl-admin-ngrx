import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { accommodationActionTypes, accommodationsLoaded } from '../actions/accommodation.actions';
import { IAccommodation } from 'src/app/models/accommodation.interface';

export interface AccommodationState extends EntityState<IAccommodation> {
    accommodationsLoaded: boolean;
}

export const adapter: EntityAdapter<IAccommodation> = createEntityAdapter<IAccommodation>();

export const initialState = adapter.getInitialState({
    accommodationsLoaded: false
});

export const accommodationReducer = createReducer(
    initialState,

    on(accommodationActionTypes.accommodationsLoaded, (state, action) => {
        return adapter.setAll(
            action.accommodations,
            { ...state, accommodationsLoaded: true }
        );
    }),

    on(accommodationActionTypes.createAccommodation, (state, action) => {
        return adapter.addOne(action.accommodation, state);
    }),

    on(accommodationActionTypes.deleteAccommodation, (state, action) => {
        return adapter.removeOne(action.accommodationId, state);
    }),

    on(accommodationActionTypes.updateAccommodation, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
