import postError from './errors';
import loadingError from './errors';

// constants
export const LOAD_DRAFTS = 'poemlapse/drafts/LOAD_DRAFTS';
export const LOAD_ACTIVE_DRAFT = 'poemlapse/drafts/LOAD_ACTIVE_DRAFT';
export const CLEAR_DRAFTS = 'poemlapse/drafts/CLEAR_DRAFTS';
export const CLEAR_ACTIVE_DRAFT = 'poemlapse/drafts/CLEAR_ACTIVE_DRAFT';

// action creators
export const loadDrafts = (drafts) => ({
    type: LOAD_DRAFTS,
    drafts
})
export const loadActiveDraft = (draft) => ({
    type: LOAD_ACTIVE_DRAFT,
    draft
})
export const clearDrafts = () => ({
    type: CLEAR_DRAFTS
})
export const clearDrafts = () => ({
    type: CLEAR_ACTIVE_DRAFT
})


// thunks
export const getDrafts = () => async (dispatch) => {
    const res = await fetch(`api/drafts`);
    if (res.ok) {
        const drafts = await res.json();
        dispatch(loadDrafts(drafts))
    } else {
        const error = res.json();
        dispatch(loadingError(error.msg))
    }
}

export const getActiveDraft = (draft_id) => async (dispatch) => {
    const res = await fetch(`api/drafts/${draft_id}`);
    if (res.ok) {
        const draft = await res.json();
        dispatch(loadActiveDraft(draft))
    } else {
        const error = res.json();
        dispatch(loadingError(error.msg))
    }
}


export const newDraft = (title) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
        },
        credentials: "include",
        body: JSON.stringify({ title }),
    };
    const res = await fetch(`api/drafts`);
    if (res.ok) {
        const draft = await res.json();
        dispatch(loadActiveDraft(draft))
    } else {
        const error = res.json();
        dispatch(postError(error.msg))
    }
}

export const updateDraft = (draft_id,
    title = null,
    changes = null,
    beginning = null) => async (dispatch, getState) => {
        const csrf = getState().csrf;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf,
            },
            credentials: "include",
            body: JSON.stringify({ title, changes, beginning }),
        };
        const res = await fetch(`api/drafts/${draft_id}`);
        if (res.ok) {
            const draft = await res.json();
            dispatch(loadActiveDraft(draft))
        } else {
            const error = res.json();
            dispatch(postError(error.msg))
        }
    }

// reducer
export default function reducer(state={activeDraft:{}, byId: {}}, action) {
    switch (action.type) {
        case LOAD_DRAFTS:
            return {...state, byId: action.drafts}
        case LOAD_ACTIVE_DRAFT:
            return {...state, activeDraft: {...action.activeDraft}}
        case CLEAR_DRAFTS:
            return {...state, byId: {}}
        case CLEAR_ACTIVE_DRAFT:
            return {...state, activeDraft: {}}
        default:
            return state;
    }
}
