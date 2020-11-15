import { postError, loadingError } from './errors';
import { fetchingDraft } from './drafts'
// constants
export const LOAD_WORKS = 'poemlapse/works/LOAD_WORKS';
export const LOAD_ONE_WORK = 'poemlapse/works/LOAD_ONE_WORK';
export const LOAD_OWN_WORKS = 'poemlapse/works/LOAD_OWN_WORKS';
export const CLEAR_WORKS = 'poemlapse/works/CLEAR_WORKS';
export const CLEAR_ONE_WORK = 'poemlapse/works/CLEAR_ONE_WORK';
export const FETCHING_WORK = 'poemlapse/works/FETCHING_WORK';
export const SAVE_WORK = 'poemlapse/works/SAVE_WORK';
export const REMOVE_SAVED_WORK = 'poemlapse/works/REMOVE_SAVED_WORK';

// action creators
export const loadWorks = (works) => ({
    type: LOAD_WORKS,
    works
})

export const loadOneWork = (work) => ({
    type: LOAD_ONE_WORK,
    work
})
export const clearWorks = () => ({
    type: CLEAR_WORKS
})
export const clearActiveWork = () => ({
    type: CLEAR_ONE_WORK
})
export const fetchingWork = (workId) => ({
    type: FETCHING_WORK,
    workId
})

export const saveWork = (workId) => ({
    type: SAVE_WORK,
    workId
})
export const removeSaved = (workId) => ({
    type: REMOVE_SAVED_WORK,
    workId
})



// thunks
export const getWorks = () => async (dispatch) => {
    const res = await fetch(`/api/works`);
    if (res.ok) {
        const works = await res.json();
        for (let work in works) {
            if (works[work].changes) {
                works[work].changes = JSON.parse(works[work].changes)
            }
        }
        dispatch(loadWorks(works))
    } else {
        const error = await res.json();
        dispatch(loadingError(error.msg))
    }
}

export const getOwnWorks = () => async (dispatch) => {
    const res = await fetch(`/api/users/me/works`);
    if (res.ok) {
        const works = await res.json();
        dispatch(loadWorks(works))
    } else {
        const error = await res.json();
        dispatch(loadingError(error.msg))
    }
}

export const getOneWork = (workId) => async (dispatch) => {
    const res = await fetch(`/api/works/${workId}`);
    if (res.ok) {
        const work = await res.json();
        if (work.changes) {
            work.changes = JSON.parse(work.changes)
        }
        dispatch(loadOneWork(work))
    } else {
        const error = await res.json();
        dispatch(loadingError(error.msg))
    }
}


export const publishWork = (draftId) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
    };
    const res = await fetch(`/api/drafts/${draftId}/works`, requestOptions);
    if (res.ok) {
        const work= await res.json();
        dispatch(fetchingWork(work.id))
    } else {
        const error = res.json();
        dispatch(postError(error.msg))
    }
}

export const unpublishWork = (workId) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
    };
    const res = await fetch(`/api/works/${workId}`, requestOptions);
    if (res.ok) {
        const draft = await res.json();
        dispatch(fetchingDraft(draft.id));
    } else {
        const error = res.json();
        dispatch(postError(error.msg));
    }
}

export const storeSaveWork = (workId) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
    };
    const res = await fetch(`/api/works/${workId}/saved`, requestOptions);
    if (res.ok) {
        const data= await res.json();
        dispatch(saveWork(data.id))
    } else {
        const error = res.json();
        dispatch(postError(error.msg))
    }
}

export const storeUnsaveWork = (workId) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
    };
    const res = await fetch(`/api/works/${workId}/saved`, requestOptions);
    if (res.ok) {
        const data= await res.json();
        dispatch(removeSaved(data.id))
    } else {
        const error = res.json();
        dispatch(postError(error.msg))
    }
}
// reducer
export default function reducer(state = { activeWork: {}, byId: {}, fetching: null }, action) {
    switch (action.type) {
        case LOAD_WORKS:
            return { ...state, byId: action.works }
        case LOAD_ONE_WORK:
            return { ...state, activeWork: action.work, fetching: null }
        case CLEAR_WORKS:
            return { ...state, byId: {} }
        case CLEAR_ONE_WORK:
            return { ...state, activeWork: {} }
        case FETCHING_WORK:
            return { ...state, activeWork: {}, fetching: action.workId };
        case SAVE_WORK: {
            const newState ={ ...state,
                activeWork: {...state.activeWork},
                byId: {...state.byId } };
            if (state.activeWork.id===action.workId) {
                newState.activeWork.saved = true;
            }
            if (state.byId[action.workId]) {
                newState.byId = {...state.byId, [action.workId]: {...state.byId[action.workId], saved: true}};
            }
            return newState;

        }
        case REMOVE_SAVED_WORK: {
            const newState ={ ...state,
                activeWork: {...state.activeWork},
                byId: {...state.byId } };
            if (state.activeWork.id===action.workId) {
                newState.activeWork.saved = false;
            }
            if (state.byId[action.workId]) {
                newState.byId = {...state.byId, [action.workId]: {...state.byId[action.workId], saved: false}};
            }
            return newState;

        }
        default:
            return state;
    }
}
