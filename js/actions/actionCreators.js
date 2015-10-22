/**
 * Created by Praveen on 11/09/2015.
 */

import * as actionTypes from '../constants/actionTypes';


export function addDevice(device) {
    return {
        type: actionTypes.ADD_DEVICE,
        device
    };

}

export function removeDevice(device) {
    return {
        type: actionTypes.REMOVE_DEVICE,
        device
    }
}

export function addDataAttributeForDevicePath(deviceAttribute) {
    return {
        type: actionTypes.ADD_DEVICE_ATTRIBUTES,
        deviceAttribute
    }
}

export function selectDevices(devices) {
    return {
        type: actionTypes.SELECTED_DEVICES,
        devices
    }
}