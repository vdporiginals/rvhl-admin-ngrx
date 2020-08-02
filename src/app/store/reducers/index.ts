import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { ScheduleState, scheduleReducer } from './schedule.reducers';
import { AccommodationState, accommodationReducer } from './accommodation.reducers';
import { AdvertiseState, advertiseReducer } from './advertise.reducers';
import { TourState, tourReducer } from './tour.reducers';
import { transferReducer, TransferState } from './transfer.reducers';
import { CuisineState, cuisineReducer } from './cuisine.reducers';
import { ImageState, imageReducer } from './image.reducers';
import { EntertainState, entertainReducer } from './entertain.reducers';
import { CategoryState, categoryReducer } from './category.reducers';
import { UserState, userReducer } from './user.reducers';
import { ReviewState, reviewReducer } from './reviews.reducers';


export interface AppState {
  schedule: ScheduleState;
  accommodation: AccommodationState;
  advertise: AdvertiseState;
  tour: TourState;
  transfer: TransferState;
  cuisine: CuisineState;
  image: ImageState;
  reviews: ReviewState;
  entertain: EntertainState;
  category: CategoryState;
  user: UserState;
  error: any;

}

export const reducers: ActionReducerMap<AppState> = {
  schedule: scheduleReducer,
  accommodation: accommodationReducer,
  advertise: advertiseReducer,
  tour: tourReducer,
  transfer: transferReducer,
  cuisine: cuisineReducer,
  image: imageReducer,
  reviews: reviewReducer,
  entertain: entertainReducer,
  category: categoryReducer,
  user: userReducer,
  error: null
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
