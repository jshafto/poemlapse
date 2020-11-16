
export const SET_AUTOSAVED = 'poemlapse/ui/SET_AUTOSAVING';
export const SET_NOT_SAVED = 'poemlapse/ui/SET_NOT_SAVED';

export const setAutosaved = () => ({
    type: SET_AUTOSAVED,
})

export const setNotSaved = () => ({
    type: SET_NOT_SAVED,
})

export default function reducer (state={autosaved: true}, action) {
    switch (action.type) {
        case SET_AUTOSAVED:
            return { autosaved: true };
        case SET_NOT_SAVED:
            return { autosaved: false };
        default:
            return state;
    }
}
