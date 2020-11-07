import { combineReducers } from 'redux';
import drafts from './drafts'

const entitiesReducer = combineReducers({
    drafts,
})

export default entitiesReducer;
