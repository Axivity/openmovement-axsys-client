/**
 * Created by Praveen on 11/09/2015.
 *
 * @flow
 */
/* system imports */
require("babel/polyfill");

/* third party lib imports */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import moment from 'moment';

/* internal imports*/
import App from './containers/AxsysApp';
import { addDevice, removeDevice, addDataAttributeForDevicePath,
    deSelectDevice, removeDetailViewForDevice } from './actions/actionCreators';
import AXApi from './ax-client';
import { DeviceCommandQueue, CommandOptions } from './utils/device-command-queue';
import axsysApp from './reducers/reducers';
import {MAP_RESPONSES_TO_ATTRIBUTE_NAMES} from './constants/commandResponseTypes';
import * as binUtils from './utils/binutils';
import * as attributeNames from './constants/attributeNames';
import {DEVICE_METADATA_ATTRIBUTES, getDevicesWithAttributesNotSet, findDeviceByPath} from './utils/device-attributes';

let store = createStore(axsysApp);

let commandResponses = {};

let commandQs = {};


let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnectedToServer(store),
    onDisconnected(store),
    onDataReceived,
    onAttributesDataPublished(store)
);


function onDeviceAdded(store) {
    return (device) => {
        store.dispatch(addDevice(device));
        setupDevice(device);
    }
}


function onDeviceRemoved(store) {
    return (device) => {
        store.dispatch(deSelectDevice({
            _id: device._id,
            mountPoint: device.volumePath
        }));
        store.dispatch(removeDevice(device));
    }
}


function onDisconnected(store) {
    return () => {
        let devices = store.getState().devices;
        devices.map((device) => {
            store.dispatch(removeDevice(device));
        });
    }
}


function removeAttributeFromWaitingList(attributeName, attributeCommandOptions, devicePath) {
    let index = -1;
    for(let i=0; i< attributeCommandOptions[devicePath].length; i++) {
        let attributeCommand = attributeCommandOptions[devicePath][i];

        if(attributeCommand.options.name === attributeName) {
            index = i;
        }
    }

    if(index > -1) {
        attributeCommandOptions[devicePath].splice(index, 1);
    }
}


function onDataReceived() {
    return (data) => {
        let returnedString = binUtils.bufferToString(data.buffer);
        let attributeName = getAttributeName(returnedString);
        let devicePath = data.path;

        // we only care about the attributes we know of.
        if(attributeName !== null) {
            // We need to remove the command from list, which holds all commands awaiting response
            removeAttributeFromWaitingList(attributeName, commandResponses, devicePath);
            // Publish data attribute to server
            sendAttributeDataToServer(devicePath, attributeName, returnedString);
        }

    }
}

function getAttributeName(returnedString) {
    let attributeName = null;
    for(let prop in MAP_RESPONSES_TO_ATTRIBUTE_NAMES) {
        if(MAP_RESPONSES_TO_ATTRIBUTE_NAMES.hasOwnProperty(prop)) {
            if(returnedString && returnedString.startsWith(prop)) {
                attributeName = MAP_RESPONSES_TO_ATTRIBUTE_NAMES[prop];
            }
        }
    }
    return attributeName;
}

function sendAttributeDataToServer(devicePath, attributeKey, attributeVal) {
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

function onAttributesDataPublished(store) {
    return (listOfChanges) => {

        for(let i=0; i<listOfChanges.length; i++) {
            let data = listOfChanges[i];
            let attributeValue = data.value.value;
            let attributeName = getAttributeName(attributeValue);

            if(attributeName != null) {
                let deviceAttribute = {
                    'path': data.path.split('/')[1].replace(/~1/g, '/'),
                    'attribute': attributeName,
                    'value': data.value
                };
                store.dispatch(addDataAttributeForDevicePath(deviceAttribute));
            }
        }
    }
}

function prepareCommandOptions(path, attributes) {
    let allCommandOptions = [];
    for(let i=0; i<attributes.length; i++) {
        let options = {
            'command': attributes[i].command,
            'path': path,
            'frequency_in_seconds': attributes[i].frequency_in_seconds,
            'name': attributes[i].name
        };
        let commandOptions = new CommandOptions(options, (writeResponse) => {
            if(writeResponse) {
                console.log('Written command to device ' + path);
            }
        });
        allCommandOptions.push(commandOptions);
    }
    return allCommandOptions;
}

function checkForResponsesAndCloseConnection(device, commandsWaitingForResponses) {
    let checker = setInterval(() => {
        let devicePath = device._id;
        let options = {};

        options.path = devicePath;
        if(commandsWaitingForResponses[devicePath].length === 0) {
            clearInterval(checker);
            api.disconnect(options, () => {
                console.log('Closed connection to device ' + devicePath);
            });
        }
    }, 1000);
}

function connectToDevice(device, attributes) {
    let options = {};
    let path = device._id;
    options.path = path;
    console.log('Connecting to device: ' + path);

    if(attributes.length > 0) {
        api.connect(options, (response) => {
            if(response) {
                let deviceCommandQ = new DeviceCommandQueue(path, api, onDataReceived());
                deviceCommandQ.start();
                commandQs[path] = deviceCommandQ;
                commandResponses[path] = [];
                console.log('Started command Q for ' + path);

                let commands = prepareCommandOptions(path, attributes);
                for(let i=0; i< commands.length; i++) {
                    deviceCommandQ.addCommand(commands[i]);
                    commandResponses[path].push(commands[i]);
                }

                checkForResponsesAndCloseConnection(device, commandResponses);

            } else {
                console.warn('Unexpected internal error in connecting to device ' + path);
            }
        });
    }
}

function applyFunctionToEachDevice(devices, fn) {
    for(let devicePath in devices) {
        if(devices.hasOwnProperty(devicePath)) {
            let device = devices[devicePath];
            fn(device);
        }
    }
}


function runCommandsToGetAttributes(devices, devicesWithAttributesNotSet) {
    console.log(devicesWithAttributesNotSet);

    for(let devicePath in devicesWithAttributesNotSet) {
        if(devicesWithAttributesNotSet.hasOwnProperty(devicePath)) {
            let attributes = devicesWithAttributesNotSet[devicePath];
            let device = findDeviceByPath(devices, devicePath);
            connectToDevice(device, attributes);
        }
    }
}


function setupDevice(device) {
    let devices = [];
    if(device.constructor === Array) {
        devices = device;
    } else {
        devices.push(device);
    }

    let deviceAttributes = store.getState().deviceAttributes;

    // check for attributes for those devices
    let devicesWithAttributesNotSet = getDevicesWithAttributesNotSet(
        devices,
        deviceAttributes,
        DEVICE_METADATA_ATTRIBUTES,
        api.getServerTimeFunction());

    runCommandsToGetAttributes(devices, devicesWithAttributesNotSet);
}


function setupDevices() {
    let devices = store.getState().devices;
    devices.forEach((device) => {
        setupDevice(device);
    });
}


function checkAttributesPeriodically() {
    setInterval(() => {
        setupDevices();
    }, 30000);
}



function onConnectedToServer(store) {
    return () => {
        api.getDevices((devices) => {
            let err = null;
            if(err) {
                // Need to handle error?
                console.error(err);

            } else {
                console.log(api.getServerTimeFunction()());

                // add device to store
                applyFunctionToEachDevice(devices, (device) => {
                    store.dispatch(addDevice(device));
                });

                checkAttributesPeriodically();
            }
        });
    }
}


// Entry point to the views
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('ax-ui-content')
);
