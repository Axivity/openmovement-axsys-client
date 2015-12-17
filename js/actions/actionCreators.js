/**
 * Created by Praveen on 11/09/2015.
 */

import * as actionTypes from '../constants/actionTypes';

/**
 *
 */
export class DeviceAttributeData {

    /**
     *
     * @param path
     * @param attributeName
     * @param attributeVal
     */
    constructor(path : String, attributeName : String, attributeVal : ?any) {
        this.path = path;
        this.attribute = attributeName;
        this.value = attributeVal;
    }
}


/**
 *
 * @param device
 * @returns {{type, device: *}}
 */
export function addDevice(device) {
    return {
        type: actionTypes.ADD_DEVICE,
        device
    };

}

/**
 *
 * @param devicePath
 * @returns {{type, devicePath: *}}
 */
export function removeDeviceWithAttributes(devicePath) {
    return {
        type: actionTypes.REMOVE_DEVICE_WITH_ATTRIBUTES,
        devicePath: devicePath
    }
}


/**
 *
 * @param device
 * @returns {{type, device: *}}
 */
export function removeDevice(device) {
    return {
        type: actionTypes.REMOVE_DEVICE,
        device
    }
}


/**
 *
 * @param deviceAttribute
 * @returns {{type, deviceAttribute: *}}
 */
export function addDataAttributeForDevicePath(deviceAttribute) {
    return {
        type: actionTypes.ADD_DEVICE_ATTRIBUTES,
        deviceAttribute
    }
}


/**
 *
 * @param device
 * @returns {{type, device: *}}
 */
export function selectDevice(device) {
    return {
        type: actionTypes.SELECT_DEVICE,
        device
    }
}


/**
 *
 * @param device
 * @returns {{type, device: *}}
 */
export function deSelectDevice(device) {
    return {
        type: actionTypes.DESELECT_DEVICE,
        device
    }
}


/**
 *
 * @param device
 * @returns {{type, device: *}}
 */
export function setDetailViewForDevice(device) {
    return {
        type: actionTypes.SET_DETAIL_VIEW_FOR_DEVICE,
        device
    }
}


/**
 *
 * @param device
 * @returns {{type, device: *}}
 */
export function removeDetailViewForDevice(device) {
    return {
        type: actionTypes.REMOVE_DETAIL_VIEW_FOR_DEVICE,
        device
    }
}


/**
 *
 * @param notification
 * @returns {{type, notification: *}}
 */
export function addNotification(notification) {
    return {
        type: actionTypes.ADD_NOTIFICATION,
        notification
    }
}


/**
 *
 * @param notification
 * @returns {{type, notification: *}}
 */
export function removeNotification(notification) {
    return {
        type: actionTypes.REMOVE_NOTIFICATION,
        notification
    }
}


/**
 *
 * @param navigationItem
 * @returns {{type, navigationItemName: *}}
 */
export function selectNavigationItem(navigationItem) {
    return {
        type: actionTypes.SELECT_NAVIGATION_ITEM,
        navigationItemName: navigationItem
    }
}


/**
 *
 * @param file
 * @returns {{type, file: *}}
 */
export function addFile(file) {
    return {
        type: actionTypes.ADD_FILE,
        file
    }
}


/**
 *
 * @param file
 * @returns {{type: *, selectedFile: *}}
 */
export function selectFile(file) {
    return {
        type: actionTypes.SELECT_FILE,
        file
    }
}


/**
 *
 * @param file
 * @returns {{type: *, selectedFile: *}}
 */
export function deSelectFile(file) {
    return {
        type: actionTypes.DESELECT_FILE,
        file
    }
}