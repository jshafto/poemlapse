import { authError, postError, clearErrors } from './errors';
import { loadActiveAuthor } from './authors';
// constants
export const SET_USER = 'poemlapse/authentication/SET_USER';
export const REMOVE_USER = 'poemlapse/authentication/REMOVE_USER';
export const LOADING_USER = 'poemlapse/authentication/LOADING_USER';
// action creators
export const setUser = (user) => ({
    type: SET_USER,
    user
})

export const removeUser = () => ({
    type: REMOVE_USER
})

export const loadingUser = () => ({
    type: LOADING_USER
})

// thunks
export const login = (email, password) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    };

    const response = await fetch(`/api/session/login`, requestOptions);
    if (response.ok) {
        const data = await response.json();
        dispatch(clearErrors());
        dispatch(setUser(data.current_user));
    } else {
        const data = await response.json();
        dispatch(removeUser());
        dispatch(authError(data.msg))
    }
};

export const logout = () => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
    };
    const response = await fetch(`/api/session/logout`, requestOptions);
    if (response.ok) {
        dispatch(removeUser());
    } else {
        dispatch(postError());
    }
}

export const signup = (username, email, password) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
    };

    const response = await fetch(`/api/session/signup`, requestOptions);
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.current_user));
    } else {
        const data = await response.json();
        dispatch(removeUser());
        dispatch(authError(data.msg))
    }
}


export const updateUserInfo= (firstName, lastName, bio) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, bio }),
    };

    const response = await fetch(`/api/users/me`, requestOptions);
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.current_user));
        dispatch(loadActiveAuthor(data.profile));
    } else {
        const data = await response.json();
        dispatch(authError(data.msg))
    }
}

// reducer
export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_USER:
            return action.user;
        case REMOVE_USER:
            return {};
        case LOADING_USER:
            return { loading: true }
        default:
            return state;

    }
}
