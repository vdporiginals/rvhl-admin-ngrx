import * as Actions from './global.actions';

export function reducer(state: any = null, action: Actions.All) {
    switch (action.type) {

        case Actions.ADD_GLOBAL_ERROR: {
            return action.payload;
        }

        default:
            return state;
    }
}

