import { loadWorks } from './works';
import { loadingError } from './errors';
import { loadSaved } from './saved';
// constants
export const LOAD_ACTIVE_AUTHOR = 'poemlapse/authors/LOAD_ACTIVE_AUTHOR';
export const LOAD_AUTHORS = 'poemlapse/authors/LOAD_AUTHORS';
export const CLEAR_ACTIVE_AUTHOR = 'poemlapse/authors/CLEAR_ACTIVE_AUTHOR';
export const CLEAR_AUTHORS = 'poemlapse/authors/CLEAR_AUTHORS';

// action creators
export const loadActiveAuthor = (author) =>({
    type: LOAD_ACTIVE_AUTHOR,
    author
})

export const loadAuthors = (authors) => ({
    type: LOAD_AUTHORS,
    authors
})

export const clearActiveAuthor = () => ({
    type: CLEAR_ACTIVE_AUTHOR,
})


export const clearAuthors = () => ({
    type: CLEAR_AUTHORS,
})



// thunks
export const getActiveAuthor = (authorId) => async (dispatch) => {
    const res = await fetch(`/api/users/${authorId}`);
    if (res.ok) {
        const data = await res.json();
        const { bio, firstName, lastName, username, displayName, works, saved} = data;
        const author = { bio, firstName, lastName, username, displayName }
        dispatch(loadActiveAuthor(author))
        dispatch(loadWorks(works))
        dispatch(loadSaved(saved))
    } else {
        const error = await res.json();
        dispatch(loadingError(error.msg))
    }
}


export default function reducer(state = { byId: {}, activeAuthor: {} }, action) {
    switch (action.type) {
        case LOAD_ACTIVE_AUTHOR:
            return { ...state, activeAuthor: action.author};
        case CLEAR_ACTIVE_AUTHOR:
            return {...state, activeAuthor: {}};
        default:
            return state;
    }
}
