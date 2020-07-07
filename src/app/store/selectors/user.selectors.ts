
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState, selectAll, selectIds } from '../reducers/user.reducers';

export const userFeatureSelector = createFeatureSelector<UserState>('users');

export const getAllUsers = createSelector(
    userFeatureSelector,
    selectAll
);

export const areUsersLoaded = createSelector(
    userFeatureSelector,
    state => state.usersLoaded
);
export const getPagination = createSelector(
    userFeatureSelector,
    state => {
        return {
            count: state.count,
            pageNum: state.pageNum
        };
    }
);