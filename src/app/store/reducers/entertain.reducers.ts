import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { entertainActionTypes, entertainsLoaded } from '../actions/entertain.actions';
import { IEntertain } from 'src/app/models/entertain.interface';

export interface EntertainState extends EntityState<IEntertain> {
    pageNum: number;
    count: number;
    entertainsLoaded: boolean;
}

export const adapter: EntityAdapter<IEntertain> = createEntityAdapter<IEntertain>({
    selectId: entertains => entertains._id
});

export const initialState = adapter.getInitialState({
    entertainsLoaded: false
});

export const entertainReducer = createReducer(
    initialState,

    on(entertainActionTypes.entertainsLoaded, (state, action) => {
        return adapter.setAll(
            action.entertains,
            {
                ...state, pageNum: action.pageNum,
                count: action.count, entertainsLoaded: true
            }
        );
    }),

    on(entertainActionTypes.createEntertain, (state, action) => {
        return adapter.addOne(action.entertain, state);
    }),

    on(entertainActionTypes.deleteEntertain, (state, action) => {
        return adapter.removeOne(action.entertainId, state);
    }),

    on(entertainActionTypes.updateEntertain, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
