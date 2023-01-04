import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import rootReducer from './rootReducer';

let middle = [thunk, promise];

if (process.env.NODE_ENV !== 'production') {
    // middle = [...middle, createLogger({collapsed: true})];
    middle = [...middle];
}

const newCreateStore = applyMiddleware(...middle)(createStore);

const store = newCreateStore(rootReducer);

export default store;
