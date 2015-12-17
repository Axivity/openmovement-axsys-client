/**
 * Created by Praveen on 12/11/2015.
 */

import * as attributeNames from '../constants/attributeNames';

// NB: The name is supposed to be unique for all these commands.
export const DEVICE_METADATA_ATTRIBUTES = [
    {
        'command': 'SAMPLE 1\r\n',
        'frequency_in_seconds': 60,
        'name': attributeNames.BATTERY,
        'timeout_in_seconds': 1,
        'type': 'READ'
    },
    {
        'command': 'ID\r\n',
        'frequency_in_seconds': 0,
        'name': attributeNames.VERSION,
        'timeout_in_seconds': 1,
        'type': 'READ'
    },
    {
        'command': 'HIBERNATE\r\n',
        'frequency_in_seconds': 0,
        'name': attributeNames.HIBERNATE,
        'timeout_in_seconds': 1,
        'type': 'READ'
    },
    {
        'command': 'STOP\r\n',
        'frequency_in_seconds': 0,
        'name': attributeNames.STOP,
        'timeout_in_seconds': 1,
        'type': 'READ'
    },
    {
        'command': 'SESSION\r\n',
        'frequency_in_seconds': 0,
        'name': attributeNames.SESSION,
        'timeout_in_seconds': 1,
        'type': 'READ'
    }

];

//const ATTRIBUTE_FREQ_THRESHOLD_IN_MILLIS = 60 * 1000;


/**
 *
 * @param devices
 * @param deviceAttributes
 * @param attributes
 * @param serverTimeFn
 */
export function getDevicesWithAttributesNotSet(
                        devices:Array<object>,
                        deviceAttributes:Object,
                        attributes:Array<Object>,
                        serverTimeFn: () => number) : ?Object {

    return checkAttributesForEachDevice(
                        devices,
                        deviceAttributes,
                        attributesChecker,
                        attributes,
                        serverTimeFn);
}

/**
 *
 * @param device
 * @param deviceAttributes
 * @param attributes
 * @param serverTimeFn
 * @returns {Array.<Object>}
 */
export function getAttributesNotSetForDevice(
                        device: Object,
                        deviceAttributes:Object,
                        attributes:Array<Object>,
                        serverTimeFn: () => number) : ?Object {

    let attributesNotSetForDevice = {};
    let devicePath = device._id;
    console.log(devicePath);

    if(deviceAttributes.hasOwnProperty(devicePath)) {
        let deviceAttributesInState = deviceAttributes[devicePath];
        attributesNotSetForDevice[devicePath] = attributesChecker(deviceAttributesInState, attributes, serverTimeFn);

    } else {
        attributesNotSetForDevice[devicePath] = attributes;
    }

    return attributesNotSetForDevice;

}


/**
 *
 * @param devices
 * @param devicePath
 * @returns {*}
 */
export function findDeviceByPath(devices:Array<Object>, devicePath: string) : ?Object {
    for(let i=0; i<devices.length; i++) {
        let device = devices[i];
        if(device._id === devicePath) {
            return device;
        }
    }
    return null;
}


/**
 *
 * @param deviceAttributes
 * @returns {Array.<T>|Array}
 */
export function getKnownAttributes(deviceAttributes : Map<String, Object>) : Array<String> {
    let keys = Object.keys(attributeNames);
    return keys.filter((key) => {
        let value = deviceAttributes[key];
        return (value !== undefined);
    });
}


/**
 *
 * @param devices
 * @param deviceAttributes
 * @param checker
 * @param attributes
 * @param serverTimeFn
 * @returns {{}}
 */
function checkAttributesForEachDevice(devices, deviceAttributes, checker, attributes, serverTimeFn) {

    let devicesWithAttributesNotFound = {};

    for(let i=0; i<devices.length; i++) {
        let device = devices[i];
        let devicePath = device._id;
        if(deviceAttributes.hasOwnProperty(devicePath)) {
            // When device attributes is set for device then find out
            // which attributes are missing and fetch from server.
            let deviceAttribute = deviceAttributes[devicePath];
            devicesWithAttributesNotFound[devicePath] = checker(deviceAttribute, attributes, serverTimeFn);

        } else {
            // When device attributes are not set yet in state tree,
            // all given "attributes" would have to be fetched/updated
            devicesWithAttributesNotFound[devicePath] = attributes;
        }
    }

    return devicesWithAttributesNotFound;
}

function attributesChecker(deviceAttribute, attributes, serverTimeFn) : Array<Object> {
    // Attributes are set of commands that are pre-configured
    // deviceAttribute is an attribute key and value store in state tree.
    // This will not have configuration related keys like 'frequency' for
    // example, which says how often an attribute is updated.
    let attributesNotSet = [];

    for(let i=0; i<attributes.length; i++) {
        let attribute = attributes[i];
        let attributeName = attribute.name;

        console.log(attribute);

        if(!deviceAttribute.hasOwnProperty(attributeName)) {
            attributesNotSet.push(attribute);

        } else {
            let devAttribute = deviceAttribute[attributeName];
            let frequency = attribute.frequency_in_seconds;
            if (isContinuouslyUpdatingAttribute(frequency)) {
                if(timeToUpdate(devAttribute, frequency, serverTimeFn)) {
                    attributesNotSet.push(attribute);
                }
            }
        }
    }
    return attributesNotSet;
}


/**
 *
 * @param devicePath
 * @param attributeKey
 * @param attributeVal
 * @param api
 */
export function sendAttributeDataToServer(devicePath, attributeKey, attributeVal, api) {
    let options = {
        'devicePath': devicePath,
        'attributeKey': attributeKey,
        'attributeVal': attributeVal.replace('\r\n', '')
    };
    api.publish(options, (data) => {
        console.log('Data Published');
        console.log(data);
    });
}

function isContinuouslyUpdatingAttribute(frequency) {
    return frequency > 0;
}

function timeToUpdate(attr, frequencyInSecs, serverTimeFn) {
    let serverTimeInMillis = parseInt(serverTimeFn());
    console.log('Server time in millis ' + serverTimeInMillis);
    console.log('Server time in millis ' + attr.timeUpdatedInMillis);
    let frequencyInMillis = frequencyInSecs * 1000;
    return serverTimeInMillis > (attr.timeUpdatedInMillis + frequencyInMillis);
}