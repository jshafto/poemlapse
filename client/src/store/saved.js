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


// reducer
export default function reducer(state = { byId: {} }, action) {
    switch (action.type) {
        case LOAD_SAVED:
            return { byId: action.works }
        case CLEAR_SAVED:
            return { byId: {} }
        default:
            return state;
    }
}
