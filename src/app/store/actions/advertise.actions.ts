
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IAdvertise } from 'src/app/models/advertise.interface';


export const loadAdvertises = createAction(
    '[Advertises List] Load Advertises via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const advertisesLoaded = createAction(
    '[Advertises Effect] Advertises Loaded Successfully',
    props<{ advertises: IAdvertise[] }>()
);

// export const AdvertiseLoaded = createAction(
//     '[Advertise Effect] Advertise Loaded Successfully',
//     props<{ Advertise: IAdvertise }>()
// );

export const createAdvertise = createAction(
    '[Create Advertise Component] Create Advertise',
    props<{ advertise: IAdvertise }>()
);

export const deleteAdvertise = createAction(
    '[Advertises List Operations] Delete Advertise',
    props<{ advertiseId: string }>()
);

export const updateAdvertise = createAction(
    '[Advertises List Operations] Update Advertise',
    props<{ update: Update<IAdvertise> }>()
);

export const advertiseActionTypes = {
    loadAdvertises,
    advertisesLoaded,
    createAdvertise,
    deleteAdvertise,
    updateAdvertise
};
