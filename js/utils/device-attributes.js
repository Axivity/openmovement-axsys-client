/**
 * Created by Praveen on 12/11/2015.
 */

import * as attributeNames from '../constants/attributeNames';

// NB: The name is supposed to be unique for all these commands.
export const DEVICE_METADATA_ATTRIBUTES = [
    {
        'command': 'SAMPLE 1\r\n',
        'frequency_in_seconds': 60,
        'name': attributeNames.BATTERY
    },
    {
        'command': 'ID\r\n',
        'frequency_in_seconds': 0,
        'name': attributeNames.VERSION
    }
];

const ATTRIBUTE_FREQ_THRESHOLD_IN_SECS = 60;


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
                        serverTimeFn: () => number) {

    return checkAttributesForEachDevice(
                        devices,
                        deviceAttributes,
                        attributesChecker,
                        attributes,
                        serverTimeFn);
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

function attributesChecker(deviceAttribute, attributes, serverTimeFn) {
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
                if(hasNotUpdatedForTheFrequencyPeriod(devAttribute, frequency, serverTimeFn)) {
                    attributesNotSet.push(attribute);
                }
            }
        }
    }
    return attributesNotSet;
}

function isContinuouslyUpdatingAttribute(frequency) {
    return frequency > 0;
}

function hasNotUpdatedForTheFrequencyPeriod(attr, frequency, serverTimeFn) {
    let serverTimeInMillis = serverTimeFn();
    console.log(serverTimeInMillis);
    return serverTimeInMillis > (attr.timeUpdatedInMillis + frequency + ATTRIBUTE_FREQ_THRESHOLD_IN_SECS)
}