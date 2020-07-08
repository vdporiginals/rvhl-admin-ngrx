import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { cuisineActionTypes, cuisinesLoaded } from '../actions/cuisine.actions';
import { ICuisine } from 'src/app/models/cuisine.interface';

export interface CuisineState extends EntityState<ICuisine> {
    count: number;
    pageNum: number;
    cuisinesLoaded: boolean;
}

export const adapter: EntityAdapter<ICuisine> = createEntityAdapter<ICuisine>(
    {
        selectId: cuisines => cuisines._id
    }
);

export const initialState = adapter.getInitialState({
    cuisinesLoaded: false
});

export const cuisineReducer = createReducer(
    initialState,

    on(cuisineActionTypes.cuisinesLoaded, (state, action) => {
        return adapter.setAll(
            action.cuisines,
            {
                ...state, pageNum: action.pageNum,
                count: action.count, cuisinesLoaded: true
            }
        );
    }),

    on(cuisineActionTypes.createCuisine, (state, action) => {
        return adapter.addOne(action.cuisine, state);
    }),

    on(cuisineActionTypes.deleteCuisine, (state, action) => {
        return adapter.removeOne(action.cuisineId, state);
    }),

    on(cuisineActionTypes.updateCuisine, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
