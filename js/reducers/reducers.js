/**
 * Created by Praveen on 11/09/2015.
 */

import { combineReducers } from 'redux';
import * as actionTypes from '../constants/actionTypes';
import * as actions from '../actions/actionCreators';

import {notifications} from './notifications-reducer';
import {navigation} from './navigation-reducer';
import {files, selectedFiles} from './files-reducer';

import {itemPresentAlready} from '../utils/general-utils';


function selectedDevices(state=[], action=null) {
    switch (action.type) {
        case actionTypes.SELECT_DEVICE:
            let presentAlready = itemPresentAlready(state, action.device, '_id');
            //console.log('Present already: ' + presentAlready);
            // add device to list of devices in selected state
            if(presentAlready) {
                // TODO: do we replace item or just ignore??
                // For now I'll ignore if it's present already as it
                // is only applicable for selections- but may need
                // revisiting.
                return state;

            } else {
                return [
                    ...state,
                    action.device
                ];
            }

        case actionTypes.DESELECT_DEVICE:
            // remove device from selected list of devices in state
            return state.filter(device =>
                device._id !== action.device._id
            );

        default:
            return state;
    }
}


function deviceAttributes(state={}, action=null) {
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
    switch (action.type) {
        case actionTypes.ADD_DEVICE:
            return [...state, action.device];

        case actionTypes.REMOVE_DEVICE:
            // remove device from state and return new state
            return state.filter(device =>
                device._id !== action.device._id
            );

        case actionTypes.REMOVE_DEVICE_WITH_ATTRIBUTES:
            // NB: This extra functionality is to remove device from state using device
            //     path rather than getting whole device object.
            return state.filter(device =>
                device._id !== action.devicePath
            );

        default:
            return state;
    }
}

function detailViewDevice(state={}, action=null) {
    switch(action.type) {
        case actionTypes.SET_DETAIL_VIEW_FOR_DEVICE:
            return action.device;

        case actionTypes.REMOVE_DETAIL_VIEW_FOR_DEVICE:
            return {};

        default:
            return state;
    }
}

export default combineReducers({
    devices,
    deviceAttributes,
    selectedDevices,
    detailViewDevice,
    notifications,
    navigation,
    files,
    selectedFiles
});