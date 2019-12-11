import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, LOAD_USER_FAILED, NO_LOCAL_TOKEN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from '../actions/types';
import setAuthToken from '../utils/setAuthToken';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
            }
        case REGISTER_FAIL:
        case LOAD_USER_FAILED:
        case NO_LOCAL_TOKEN:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            setAuthToken(localStorage.token);
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            }
        default:
            return state;
    }
}