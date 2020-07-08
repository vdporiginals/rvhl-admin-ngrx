
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IAccommodation } from 'src/app/models/accommodation.interface';


export const loadAccommodations = createAction(
    '[Accommodations List] Load Accommodations via Service',
    props<{
        apiName: string;
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const accommodationsLoaded = createAction(
    '[Accommodations Effect] Accommodations Loaded Successfully',
    props<{
        apiName: string, accommodations: IAccommodation[],
        pageNum: number,
        count: number
    }>()
);

// export const AccommodationLoaded = createAction(
//     '[Accommodation Effect] Accommodation Loaded Successfully',
//     props<{ Accommodation: IAccommodation }>()
// );

export const createAccommodation = createAction(
    '[Create Accommodation Component] Create Accommodation',
    props<{ apiName: string, accommodation: IAccommodation }>()
);

export const deleteAccommodation = createAction(
    '[Accommodations List Operations] Delete Accommodation',
    props<{ apiName: string, accommodationId: string }>()
);

export const updateAccommodation = createAction(
    '[Accommodations List Operations] Update Accommodation',
    props<{ apiName: string, update: Update<IAccommodation> }>()
);

export const accommodationActionTypes = {
    loadAccommodations,
    accommodationsLoaded,
    createAccommodation,
    deleteAccommodation,
    updateAccommodation
};
