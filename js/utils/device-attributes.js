/**
 * Created by Praveen on 12/11/2015.
 */

const ATTRIBUTE_FREQ_THRESHOLD_IN_SECS = 60;

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

function attributesChecker(device, attributes, serverTimeFn) {
    let attributesNotSet = [];

    for(let i=0; i<attributes.length; i++) {
        let attribute = attributes[i];
        let attributeName = attribute.name;

        if(!device.hasOwnProperty(attributeName)) {
            attributesNotSet.push(attribute);
        } else {
            let devAttribute = device[attributeName];
            if (isContinuouslyUpdatingAttribute(devAttribute)) {
                if(hasNotUpdatedForTheFrequencyPeriod(devAttribute, serverTimeFn)) {
                    attributesNotSet.push(devAttribute);
                }
            }
        }
    }
    return attributesNotSet;
}

function isContinuouslyUpdatingAttribute(attr) {
    return attr.frequency > 0;
}

function hasNotUpdatedForTheFrequencyPeriod(attr, serverTimeFn) {
    return serverTimeFn() > (attr.updatedEpoch + attr.frequency + ATTRIBUTE_FREQ_THRESHOLD_IN_SECS)
}