import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth'

//components can access state from here.
export default combineReducers({
    alert: alert,
    auth: auth
});