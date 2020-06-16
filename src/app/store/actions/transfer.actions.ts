
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ITransfer } from 'src/app/models/transfer.interface';


export const loadTransfers = createAction(
    '[Transfers List] Load Transfers via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const transfersLoaded = createAction(
    '[Transfers Effect] Transfers Loaded Successfully',
    props<{ transfers: ITransfer[] }>()
);

// export const TransferLoaded = createAction(
//     '[Transfer Effect] Transfer Loaded Successfully',
//     props<{ Transfer: ITransfer }>()
// );

export const createTransfer = createAction(
    '[Create Transfer Component] Create Transfer',
    props<{ transfer: ITransfer }>()
);

export const deleteTransfer = createAction(
    '[Transfers List Operations] Delete Transfer',
    props<{ transferId: string }>()
);

export const updateTransfer = createAction(
    '[Transfers List Operations] Update Transfer',
    props<{ update: Update<ITransfer> }>()
);

export const transferActionTypes = {
    loadTransfers,
    transfersLoaded,
    createTransfer,
    deleteTransfer,
    updateTransfer
};
