export const AUTH_ERROR = 'poemlapse/errors/AUTH_ERROR';

export const authError = (msg) => ({
    type: AUTH_ERROR,
    msg
})

export default function reducer(state = {}, action) {
    switch (action.type) {
        case AUTH_ERROR:
            return {auth: action.msg};
        default: {
            return state;
        }
    }
}
