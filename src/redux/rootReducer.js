import { combineReducers } from "redux";
import homeReducer from "./reducers/home";
import loginReducer from './reducers/login';
import { reducer as formReducer } from 'redux-form';

const reducer = combineReducers({
    homeReducer,
    loginReducer,
    form: formReducer
});

const appReducer = (state, action) => {
    let newState = state;
    if (action === 'LOG_OUT') {
        newState = undefined;
    }
    return reducer(newState, action)
}

export default appReducer;
