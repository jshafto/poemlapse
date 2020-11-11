import { combineReducers } from 'redux';
import drafts from './drafts';
import works from './works';

const entitiesReducer = combineReducers({
    drafts,
    works,
})

export default entitiesReducer;
