import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ICategory } from 'src/app/models/category.interface';
import { categoryActionTypes } from '../actions/category.actions';

export interface CategoryState extends EntityState<ICategory> {
    routeName: string;
    count: number;
    pageNum: number;
    categoriesLoaded: boolean;
}

export const adapter: EntityAdapter<ICategory> = createEntityAdapter<ICategory>({
    selectId: category => category._id
});

export const initialState = adapter.getInitialState({
    routeName: '',
    categoriesLoaded: false
});

export const categoryReducer = createReducer(
    initialState,

    on(categoryActionTypes.categoriesLoaded, (state, action) => {
        return adapter.setAll(
            action.categories,
            {
                ...state, routeName: action.routeName,
                pageNum: action.pageNum,
                count: action.count, categoriesLoaded: true
            }
        );
    }),

    on(categoryActionTypes.createCategory, (state, action) => {
        return adapter.addOne(action.category, state);
    }),

    on(categoryActionTypes.deleteCategory, (state, action) => {
        return adapter.removeOne(action.categoryId, state);
    }),

    on(categoryActionTypes.updateCategory, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
