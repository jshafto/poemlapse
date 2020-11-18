import { postError, loadingError } from './errors';

// constants
export const LOAD_DRAFTS = 'poemlapse/drafts/LOAD_DRAFTS';
export const LOAD_ACTIVE_DRAFT = 'poemlapse/drafts/LOAD_ACTIVE_DRAFT';
export const CLEAR_DRAFTS = 'poemlapse/drafts/CLEAR_DRAFTS';
export const CLEAR_ACTIVE_DRAFT = 'poemlapse/drafts/CLEAR_ACTIVE_DRAFT';
export const FETCHING_DRAFT = 'poemlapse/drafts/FETCHING_DRAFT';
export const REMOVE_DRAFT = 'poemlapse/drafts/REMOVE_DRAFT';

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
export const clearActiveDraft = () => ({
    type: CLEAR_ACTIVE_DRAFT
})
export const fetchingDraft = (draftId) => ({
    type: FETCHING_DRAFT,
    draftId
})
export const removeDraft = (draftId) => ({
    type: REMOVE_DRAFT,
    draftId
})

// thunks
export const getDrafts = () => async (dispatch) => {
    const res = await fetch(`/api/drafts`);
    if (res.ok) {
        const drafts = await res.json();
        dispatch(loadDrafts(drafts))
    } else {
        const error = await res.json();
        dispatch(loadingError(error.msg))
    }
}

export const getActiveDraft = (draftId) => async (dispatch) => {
    const res = await fetch(`/api/drafts/${draftId}`);
    if (res.ok) {
        const draft = await res.json();
        dispatch(loadActiveDraft(draft))
    } else {
        if (res.status===404) {
            const error = await res.json();
            dispatch(loadingError(error.msg))
        } else if (res.status===401) {
            dispatch(loadingError('Draft not found'))
        }
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
    const res = await fetch(`/api/drafts`, requestOptions);
    if (res.ok) {
        const draft = await res.json();
        dispatch(fetchingDraft(draft.id))
    } else {
        const error = res.json();
        dispatch(postError(error.msg))
    }
}

export const updateDraft = (draftId,
    title = null,
    changes = null,
    beginning = null) => async (dispatch, getState) => {
        const csrf = getState().csrf;
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf,
            },
            credentials: "include",
            body: JSON.stringify({ title, changes, beginning }),
        };
        const res = await fetch(`/api/drafts/${draftId}`, requestOptions);
        if (res.ok) {
            const draft = await res.json();
            dispatch(loadActiveDraft(draft))
        } else {
            const error = res.json();
            dispatch(postError(error.msg))
        }
    }


export const deleteDraft = (draftId) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: "DELETE",
        headers: {
            "X-CSRFToken": csrf,
        },
        credentials: "include",
    };
    const res = await fetch(`/api/drafts/${draftId}`, requestOptions);
    if (res.ok) {
        dispatch(removeDraft(draftId))
    } else {
        const error = res.json();
        dispatch(postError(error.msg))
    }
}
// reducer
export default function reducer(state = { activeDraft: {}, byId: {}, fetching: null }, action) {
    switch (action.type) {
        case LOAD_DRAFTS:
            return { ...state, byId: action.drafts }
        case LOAD_ACTIVE_DRAFT:
            return { ...state, activeDraft: action.draft, fetching: null }
        case CLEAR_DRAFTS:
            return { ...state, byId: {} }
        case CLEAR_ACTIVE_DRAFT:
            return { ...state, activeDraft: {} }
        case FETCHING_DRAFT:
            return { ...state, activeDraft: {}, fetching: action.draftId }
        case REMOVE_DRAFT:
            const newState = { ...state, byId: { ...state.byId } };
            const id = action.draftId;
            delete newState.byId[id];
            return newState;
        default:
            return state;
    }
}
