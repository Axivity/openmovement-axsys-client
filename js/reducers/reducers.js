/**
 * Created by Praveen on 11/09/2015.
 */

import { combineReducers } from 'redux';
import { ADD_DEVICE } from '../constants/actionTypes';
import * as actions from '../actions/actionCreators';

let initialState = {
    devices: []
};

function devices(state, action) {
    switch (action.type) {
        case ADD_DEVICE:
            return [...state, {
                device: action.device,
                configured: false
            }];
        default:
            return initialState;
    }
}

//export default function axsysApp(state, action) {
//    console.log(state);
//    return {
//        devices: devices(state.devices, action)
//    }
//}

export default combineReducers({
   devices
});