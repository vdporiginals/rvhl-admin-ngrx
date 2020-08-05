import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { authActionTypes } from '../actions/auth.actions';
import { IUser } from 'src/app/models/user.interface';

export interface AdvertiseState extends EntityState<IUser> {
    loggedIn: boolean;
    email: string;
    password: string;
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>({
    selectId: auth => auth._id
});

export const initialState = adapter.getInitialState({
    loggedIn: false,
    email: '',
    password: ''
});

export const advertiseReducer = createReducer(
    initialState,
    on(authActionTypes.login, (state, action) => {
        return adapter.setAll(
            action,
            {
                ...state, advertisesLoaded: true
            }
        );
    }),

    on(authActionTypes.createAdvertise, (state, action) => {
        return adapter.addOne(action.advertise, state);
    }),

);

export const { selectAll, selectIds } = adapter.getSelectors();
