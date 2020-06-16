

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadUsers } from 'src/app/store/actions/user.actions';
import { AppState } from 'src/app/store/reducers';
import { areUsersLoaded } from 'src/app/store/selectors/user.selectors';

@Injectable()
export class UserResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areUsersLoaded),
                tap((usersLoaded) => {
                    if (!usersLoaded) {
                        this.store.dispatch(loadUsers({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(usersLoaded => usersLoaded),
                first()
            );
    }
}
