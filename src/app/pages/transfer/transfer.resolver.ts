

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadTransfers } from 'src/app/store/actions/transfer.actions';
import { AppState } from 'src/app/store/reducers';
import { areTransfersLoaded } from 'src/app/store/selectors/transfer.selectors';

@Injectable()
export class TransferResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areTransfersLoaded),
                tap((transfersLoaded) => {
                    if (!transfersLoaded) {
                        this.store.dispatch(loadTransfers({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(transfersLoaded => transfersLoaded),
                first()
            );
    }
}