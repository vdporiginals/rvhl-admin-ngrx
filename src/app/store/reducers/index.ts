import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { ScheduleState } from './schedule.reducers';


export interface AppState {
  // schedule: ScheduleState;s
  error: any;

}

export const reducers: ActionReducerMap<AppState> = {
  // schedule,
  error: null
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
