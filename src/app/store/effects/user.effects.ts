
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { userActionTypes } from '../actions/user.actions';
import { UserService } from 'src/app/pages/user/user.service';

@Injectable()
export class UserEffects {

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActionTypes.loadUsers),
            concatMap((actions) => this.userService.getDatas('users', actions.params)),
            map((users: any) => userActionTypes.usersLoaded({ users: users.data }))
        )
    );

    createUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActionTypes.createUser),
            concatMap((action) => this.userService.create('users', action.user)),
            tap(() => this.router.navigateByUrl('/users'))
        ),
        { dispatch: false }
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActionTypes.deleteUser),
            concatMap((action) => this.userService.delete('users', action.userId))
        ),
        { dispatch: false }
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActionTypes.updateUser),
            concatMap((action) => this.userService.update('users', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private userService: UserService, private actions$: Actions, private router: Router) { }
}
