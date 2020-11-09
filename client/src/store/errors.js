export const AUTH_ERROR = 'poemlapse/errors/AUTH_ERROR';
export const POST_ERROR = 'poemlapse/errors/POST_ERROR';
export const LOADING_ERROR = 'poemlapse/errors/LOADING_ERROR';
export const CLEAR_ERRORS = 'poemlapse/errors/CLEAR_ERRORS'

export const authError = (msg) => ({
    type: AUTH_ERROR,
    msg
})

export const postError = (msg) => ({
    type: POST_ERROR,
    msg
})

export const loadingError = (msg) => ({
    type: LOADING_ERROR,
    msg
})

export const clearErrors = () => ({
    type: CLEAR_ERRORS
})

export default function reducer(state = {}, action) {
    switch (action.type) {
        case AUTH_ERROR:
            return {auth: action.msg};
        case POST_ERROR:
            return {post: action.msg};
        case LOADING_ERROR:
            return {load: action.msg}
        case CLEAR_ERRORS:
            return {}
        default: {
            return state;
        }
    }
}
