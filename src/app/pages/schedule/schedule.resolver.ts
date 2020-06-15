

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { loadSchedules } from 'src/app/store/actions/schedule.actions';
import { AppState } from 'src/app/store/reducers';
import { areSchedulesLoaded } from 'src/app/store/selectors/schedule.selectors';

@Injectable()
export class ScheduleResolver implements Resolve<Observable<any>> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
                select(areSchedulesLoaded),
                tap((schedulesLoaded) => {
                    if (!schedulesLoaded) {
                        this.store.dispatch(loadSchedules({
                            params: {
                                limit: 10,
                                page: 1
                            }
                        }));
                    }
                }),
                filter(schedulesLoaded => schedulesLoaded),
                first()
            );
    }
}