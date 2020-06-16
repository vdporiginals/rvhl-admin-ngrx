
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IUser } from 'src/app/models/user.interface';


export const loadUsers = createAction(
    '[Users List] Load Users via Service',
    props<{
        params: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
        },
    }>()
);

export const usersLoaded = createAction(
    '[Users Effect] Users Loaded Successfully',
    props<{ users: IUser[] }>()
);

// export const UserLoaded = createAction(
//     '[User Effect] User Loaded Successfully',
//     props<{ User: IUser }>()
// );

export const createUser = createAction(
    '[Create User Component] Create User',
    props<{ user: IUser }>()
);

export const deleteUser = createAction(
    '[Users List Operations] Delete User',
    props<{ userId: string }>()
);

export const updateUser = createAction(
    '[Users List Operations] Update User',
    props<{ update: Update<IUser> }>()
);

export const userActionTypes = {
    loadUsers,
    usersLoaded,
    createUser,
    deleteUser,
    updateUser
};
