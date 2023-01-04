import { ActionType } from "redux-promise-middleware";
import {logInService} from "../../services/loginServices";

const LOG_IN = 'LOG_IN';

const initialState = {
    isError: false,
}

const loginReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case `${LOG_IN}_${ActionType.Fulfilled}`:
            localStorage.setItem('access-token', action.payload.data.adminLogin.accessToken)
            return{
                ...state,
                isError: false,
            }
        case `${LOG_IN}_${ActionType.Rejected}`:
            return{
                ...state,
                isError: true,
            }
        default:
            return state
    }
}

export const logIn = (data) => {
    return {
        type: LOG_IN,
        payload: logInService(data)
    }
}



export default loginReducer;
