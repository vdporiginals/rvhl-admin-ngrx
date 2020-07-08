
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ICuisine } from 'src/app/models/cuisine.interface';


export const loadCuisines = createAction(
    '[Cuisines List] Load Cuisines via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const cuisinesLoaded = createAction(
    '[Cuisines Effect] Cuisines Loaded Successfully',
    props<{
        cuisines: ICuisine[],
        pageNum: number,
        count: number
    }>()
);

// export const CuisineLoaded = createAction(
//     '[Cuisine Effect] Cuisine Loaded Successfully',
//     props<{ Cuisine: ICuisine }>()
// );

export const createCuisine = createAction(
    '[Create Cuisine Component] Create Cuisine',
    props<{ cuisine: ICuisine }>()
);

export const deleteCuisine = createAction(
    '[Cuisines List Operations] Delete Cuisine',
    props<{ cuisineId: string }>()
);

export const updateCuisine = createAction(
    '[Cuisines List Operations] Update Cuisine',
    props<{ update: Update<ICuisine> }>()
);

export const cuisineActionTypes = {
    loadCuisines,
    cuisinesLoaded,
    createCuisine,
    deleteCuisine,
    updateCuisine
};
