import { ActionType} from "redux-promise-middleware";
import {getAdminDataService} from '../../services/homeServices'

const GET_ADMIN = 'GET_ADMIN';
const DECREMENT = 'DECREMENT';

const initialState = {
    num: 0,
    admin: {}
}

const homeReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case `${GET_ADMIN}_${ActionType.Fulfilled}`:
            return{
                ...state,
                admin: action.payload.data.admin
            }
        case `${DECREMENT}`:
            return{
                ...state,
                num: state.num--
            }
        default:
            return state
    }
}

export const getAdminData = () => {
    return{
        type: GET_ADMIN,
        payload: getAdminDataService()
    }
}

export default homeReducer;
