import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { transferActionTypes, transfersLoaded } from '../actions/transfer.actions';
import { ITransfer } from 'src/app/models/transfer.interface';

export interface TransferState extends EntityState<ITransfer> {
    transfersLoaded: boolean;
}

export const adapter: EntityAdapter<ITransfer> = createEntityAdapter<ITransfer>(
    {
        selectId: transfers => transfers._id
    }
);

export const initialState = adapter.getInitialState({
    transfersLoaded: false
});

export const transferReducer = createReducer(
    initialState,

    on(transferActionTypes.transfersLoaded, (state, action) => {
        return adapter.setAll(
            action.transfers,
            { ...state, transfersLoaded: true }
        );
    }),

    on(transferActionTypes.createTransfer, (state, action) => {
        return adapter.addOne(action.transfer, state);
    }),

    on(transferActionTypes.deleteTransfer, (state, action) => {
        return adapter.removeOne(action.transferId, state);
    }),

    on(transferActionTypes.updateTransfer, (state, action) => {
        return adapter.updateOne(action.update, state);
    })
);

export const { selectAll, selectIds } = adapter.getSelectors();
