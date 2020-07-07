
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TransferState, selectAll, selectIds } from '../reducers/transfer.reducers';

export const transferFeatureSelector = createFeatureSelector<TransferState>('transfers');

export const getAllTransfers = createSelector(
    transferFeatureSelector,
    selectAll
);

export const areTransfersLoaded = createSelector(
    transferFeatureSelector,
    state => state.transfersLoaded
);

export const getPagination = createSelector(
    transferFeatureSelector,
    state => {
        return {
            count: state.count,
            pageNum: state.pageNum
        };
    }
);