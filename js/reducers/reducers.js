/**
 * Created by Praveen on 11/09/2015.
 */

import { combineReducers } from 'redux';
import { ADD_DEVICE, REMOVE_DEVICE } from '../constants/actionTypes';
import * as actions from '../actions/actionCreators';

function devices(state = [], action = null) {
    console.log(state);

    console.log(action.type);

    switch (action.type) {
        case ADD_DEVICE:
            return [...state, action.device];
            //return [...state, {
            //    device: action.device
            //}];
            //{
            //    devices: [
            //        // copy original state
            //        ...state,
            //
            //        // add new device
            //        {
            //            device: action.device,
            //            configured: false
            //        }
            //    ]
            //};

        case REMOVE_DEVICE:
            console.log(state);
            console.log(action.device);
            // remove device from state and return new state
            return state.filter(device =>
                device.serialNumber !== action.device.serialNumber
            );

        default:
            return state;
    }
}

export default combineReducers({
   devices
});