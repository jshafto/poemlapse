import { removeUser, setUser } from './authentication'
// constants
export const SET_CSRF_TOKEN = 'poemlapse/csrf/SET_CSRF_TOKEN';


// action creators
export const setCSRF = (csrfToken) => ({
    type: SET_CSRF_TOKEN,
    csrfToken,
});



// thunks
export const restoreCSRF = () => async (dispatch) => {
    const response = await fetch("/api/session/csrf/restore", {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        const authData = await response.json();
        if (authData.csrf_token) {
            dispatch(setCSRF(authData.csrf_token));
        }
        if (authData.current_user) {
            //   Change to set current user dispatch call
            dispatch(setUser(authData.current_user));
        } else {
            dispatch(removeUser());
        }
    }
};

// reducer
export default function reducer(state = "", action) {
    switch (action.type) {
        case SET_CSRF_TOKEN:
            return action.csrfToken;
        default:
            return state;
    }
}
