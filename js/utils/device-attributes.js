/**
 * Created by Praveen on 12/11/2015.
 */

const ATTRIBUTE_FREQ_THRESHOLD_IN_SECS = 60;

export function getDevicesWithAttributesNotSet(
                        devices:Array<Object>,
                        attributes:Array<Object>,
                        serverTimeFn: () => number) {
    return checkAttributesForEachDevice(devices, attributesChecker, attributes, serverTimeFn);
}

function checkAttributesForEachDevice(devices, checker, attributes, serverTimeFn) {
    let devicesWithAttributesNotFound = {};

    for(let devicePath in devices) {

        if (devices.hasOwnProperty(devicePath)) {
            let device = devices[devicePath];
            devicesWithAttributesNotFound[devicePath] = checker(device, attributes, serverTimeFn);
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