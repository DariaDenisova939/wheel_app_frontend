import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Use curly braces to import thunk
import spinReducer from '../components/SpinCounter/spinReducer';

const store = createStore(spinReducer, applyMiddleware(thunk));

export default store;
