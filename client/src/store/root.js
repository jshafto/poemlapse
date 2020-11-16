import { combineReducers } from 'redux';
import authentication from './authentication';
import entities from './entities';
import csrf from './csrf';
import errors from './errors';
import ui from './ui'

const rootReducer = combineReducers({
    authentication,
    csrf,
    entities,
    ui,
    errors,
})

export default rootReducer;
