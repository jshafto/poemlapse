import { loadingError } from './errors';
import { REMOVE_SAVED_WORK } from './works';

// constants
export const LOAD_SAVED = 'poemlapse/saved/LOAD_SAVED';
export const CLEAR_SAVED = 'poemlapse/saved/CLEAR_SAVED';

// action creators
export const loadSaved = (works) => ({
    type: LOAD_SAVED,
    works
})


export const clearSaved = () => ({
    type: CLEAR_SAVED
})


// thunks
export const getOwnSavedWorks = () => async (dispatch) => {
    const res = await fetch(`/api/users/me/saved`);
    if (res.ok) {
        const works = await res.json();
        dispatch(loadSaved(works))
    } else {
        const error = await res.json();
        dispatch(loadingError(error.msg))
    }

}


// reducer
export default function reducer(state = { byId: {} }, action) {
    switch (action.type) {
        case LOAD_SAVED:
            return { byId: action.works }
        case CLEAR_SAVED:
            return { byId: {} }
        case REMOVE_SAVED_WORK: {
            const newState = { byId: { ...state.byId } };
            const id = action.workId;
            delete newState.byId[id];
            return newState;
        }
        default:
            return state;
    }
}
