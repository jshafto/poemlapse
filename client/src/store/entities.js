import { combineReducers } from 'redux';
import drafts from './drafts';
import works from './works';
import authors from './authors';
import saved from './saved';

const entitiesReducer = combineReducers({
    drafts,
    works,
    authors,
    saved,
})

export default entitiesReducer;
