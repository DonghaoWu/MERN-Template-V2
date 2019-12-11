import { SET_ALERT, REMOVE_ALERT } from './types';
import uuid from 'uuid';

export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {
            msg: msg,
            alertType: alertType,
            id: id
        }
    });

    setTimeout(() => dispatch({
        type: REMOVE_ALERT,
        payload: id,
    }), 3000);
}