import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { userActionTypes, usersLoaded } from '../actions/user.actions';
import { IUser } from 'src/app/models/user.interface';

export interface UserState extends EntityState<IUser> {
    usersLoaded: boolean;
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

export const initialState = adapter.getInitialState({
    usersLoaded: false
});

export const userReducer = createReducer(
    initialState,

    on(userActionTypes.usersLoaded, (state, action) => {
        return adapter.setAll(
            action.users,
            { ...state, usersLoaded: true }
        );
    }),

    on(userActionTypes.createUser, (state, action) => {
        return adapter.addOne(action.user, state);
    }),

    on(userActionTypes.deleteUser, (state, action) => {
        return adapter.removeOne(action.userId, state);
    }),

    on(userActionTypes.updateUser, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
