/**
 * Created by Praveen on 11/09/2015.
 */

import { ADD_DEVICE, REMOVE_DEVICE, ADD_DEVICE_ATTRIBUTES } from '../constants/actionTypes';


export function addDevice(device) {
    return {
        type: ADD_DEVICE,
        device
    };

}

export function removeDevice(device) {
    return {
        type: REMOVE_DEVICE,
        device
    }
}

export function addDataAttributeForDevicePath(deviceAttribute) {
    return {
        type: ADD_DEVICE_ATTRIBUTES,
        deviceAttribute
    }
}