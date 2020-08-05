
import { createAction, props } from '@ngrx/store';
export const login = createAction('[Login] User Login', props<{ email: string, password: string }>());
export const logout = createAction('[Logout] User Logout');
export const authActionTypes = {
    login,
    logout
};
