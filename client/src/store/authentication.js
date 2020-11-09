import { authError, clearErrors } from './errors'
// constants
export const SET_USER = 'poemlapse/authentication/SET_USER';
export const REMOVE_USER = 'poemlapse/authentication/REMOVE_USER';
// action creators
export const setUser = (user) => ({
    type: SET_USER,
    user
})

export const removeUser = () => ({
    type: REMOVE_USER
})

// thunks
export const login = (email, password) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    };

    const response = await fetch(`/api/session/login`, requestOptions);
    if (response.ok) {
        const data = await response.json();
        dispatch(clearErrors());
        dispatch(setUser(data.current_user));
    } else {
        const data = await response.json();
        dispatch(authError(data.msg))
    }
};

export const logout = () => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
        },
        credentials: "include",
    };
    const response = await fetch(`/api/session/logout`, requestOptions);
    if (response.ok) {
        dispatch(removeUser());
    } else {
        // change to actual dispatch of error
        console.log("error")
    }
}

export const signup = (username, email, password) => async (dispatch, getState) => {
    const csrf = getState().csrf;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
    };

    const response = await fetch(`/api/session/signup`, requestOptions);
    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.current_user));
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
        default:
            return state;

    }
}
