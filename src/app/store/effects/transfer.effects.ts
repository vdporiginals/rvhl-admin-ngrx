
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { transferActionTypes } from '../actions/transfer.actions';
import { TransferService } from 'src/app/pages/transfer/transfer.service';

@Injectable()
export class TransferEffects {

    loadTransfers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(transferActionTypes.loadTransfers),
            concatMap((actions) => this.transferService.getDatas('transfers', actions.params)),
            map((transfers: any) => transferActionTypes.transfersLoaded({ transfers: transfers.data }))
        )
    );

    createTransfer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(transferActionTypes.createTransfer),
            concatMap((action) => this.transferService.create('transfers', action.transfer)),
            tap(() => this.router.navigateByUrl('/transfers'))
        ),
        { dispatch: false }
    );

    deleteTransfer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(transferActionTypes.deleteTransfer),
            concatMap((action) => this.transferService.delete('transfers', action.transferId))
        ),
        { dispatch: false }
    );

    updateTransfer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(transferActionTypes.updateTransfer),
            concatMap((action) => this.transferService.update('transfers', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private transferService: TransferService, private actions$: Actions, private router: Router) { }
}
