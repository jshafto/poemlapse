import { combineReducers } from 'redux';
import authentication from './authentication';
// import entities from './entities';
import csrf from './csrf';
import errors from './errors'

const rootReducer = combineReducers({
    authentication,
    csrf,
    // entities,
    errors,
})

export default rootReducer;
