import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { advertiseActionTypes, advertisesLoaded } from '../actions/advertise.actions';
import { IAdvertise } from 'src/app/models/advertise.interface';

export interface AdvertiseState extends EntityState<IAdvertise> {
    pageNum: number;
    count: number;
    advertisesLoaded: boolean;
}

export const adapter: EntityAdapter<IAdvertise> = createEntityAdapter<IAdvertise>({
    selectId: advertises => advertises._id
});

export const initialState = adapter.getInitialState({
    pageNum: 0,
    count: 0,
    advertisesLoaded: false
});

export const advertiseReducer = createReducer(
    initialState,
    on(advertiseActionTypes.advertisesLoaded, (state, action) => {
        return adapter.setAll(
            action.advertises,
            {
                ...state, pageNum: action.pageNum,
                count: action.count, advertisesLoaded: true
            }
        );
    }),

    on(advertiseActionTypes.createAdvertise, (state, action) => {
        return adapter.addOne(action.advertise, state);
    }),

    on(advertiseActionTypes.deleteAdvertise, (state, action) => {
        return adapter.removeOne(action.advertiseId, state);
    }),

    on(advertiseActionTypes.updateAdvertise, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
