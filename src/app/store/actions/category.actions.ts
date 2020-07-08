
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ICategory } from 'src/app/models/category.interface';


export const loadCategories = createAction(
    '[Categories List] Load Categories via Service',
    props<{
        routeName: string;
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const categoriesLoaded = createAction(
    '[Categories Effect] Categories Loaded Successfully',
    props<{
        routeName: string, categories: ICategory[],
        pageNum: number,
        count: number
    }>()
);

// export const CategoryLoaded = createAction(
//     '[Category Effect] Category Loaded Successfully',
//     props<{ Category: ICategory }>()
// );

export const createCategory = createAction(
    '[Create Category Component] Create Category',
    props<{ routeName: string, category: ICategory }>()
);

export const deleteCategory = createAction(
    '[Categories List Operations] Delete Category',
    props<{ routeName: string, categoryId: string }>()
);

export const updateCategory = createAction(
    '[Categories List Operations] Update Category',
    props<{ routeName: string, update: Update<ICategory> }>()
);

export const categoryActionTypes = {
    loadCategories,
    categoriesLoaded,
    createCategory,
    deleteCategory,
    updateCategory
};
