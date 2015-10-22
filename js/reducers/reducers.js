/**
 * Created by Praveen on 11/09/2015.
 */

import { combineReducers } from 'redux';
import * as actionTypes from '../constants/actionTypes';
import * as actions from '../actions/actionCreators';


function selectedDevices(state=[], action=null) {
    switch (action.type) {
        case actionTypes.SELECTED_DEVICES:
            return [
                ...state,
                ...action.devices
            ];

        default:
            return state;
    }
}


function deviceAttributes(state={}, action=null) {
    console.log('device attributes');
    console.log(state);

    switch(action.type) {
        case actionTypes.ADD_DEVICE_ATTRIBUTES:
            let newState = {};
            if (state[action.deviceAttribute.path]) {
                newState = state[action.deviceAttribute.path];
                newState[action.deviceAttribute.attribute] = action.deviceAttribute.value;

            } else {
                newState = {
                    [action.deviceAttribute.path]: {
                        [action.deviceAttribute.attribute]: action.deviceAttribute.value
                    }
                };
            }

            return Object.assign({}, state, newState);

        default:
            return state;
    }
}

function devices(state = [], action = null) {
    console.log(state);

    console.log(action.type);

    switch (action.type) {
        case actionTypes.ADD_DEVICE:
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

        case actionTypes.REMOVE_DEVICE:
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
    devices,
    deviceAttributes,
    selectedDevices
});