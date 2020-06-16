
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IEntertain } from 'src/app/models/entertain.interface';


export const loadEntertains = createAction(
    '[Entertains List] Load Entertains via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const entertainsLoaded = createAction(
    '[Entertains Effect] Entertains Loaded Successfully',
    props<{ entertains: IEntertain[] }>()
);

// export const EntertainLoaded = createAction(
//     '[Entertain Effect] Entertain Loaded Successfully',
//     props<{ Entertain: IEntertain }>()
// );

export const createEntertain = createAction(
    '[Create Entertain Component] Create Entertain',
    props<{ entertain: IEntertain }>()
);

export const deleteEntertain = createAction(
    '[Entertains List Operations] Delete Entertain',
    props<{ entertainId: string }>()
);

export const updateEntertain = createAction(
    '[Entertains List Operations] Update Entertain',
    props<{ update: Update<IEntertain> }>()
);

export const entertainActionTypes = {
    loadEntertains,
    entertainsLoaded,
    createEntertain,
    deleteEntertain,
    updateEntertain
};
