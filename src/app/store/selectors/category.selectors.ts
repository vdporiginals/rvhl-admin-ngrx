
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CategoryState, selectAll, selectIds } from '../reducers/category.reducers';
import { categoriesLoaded } from '../actions/category.actions';

export const categoryFeatureSelector = createFeatureSelector<CategoryState>('categories');

export const getAllCategories = createSelector(
    categoryFeatureSelector,
    selectAll
);

export const areCategoriesLoaded = createSelector(
    categoryFeatureSelector,
    state => {
        return {
            routeName: state.routeName,
            categoriesLoaded: state.categoriesLoaded
        };
    },
);

export const getPagination = createSelector(
    categoryFeatureSelector,
    state => {
        return {
            count: state.count,
            pageNum: state.pageNum
        };
    }
);
