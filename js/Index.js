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
import {RESPONSES_START_WITH_STRING} from './constants/commandResponseTypes';
import * as binUtils from './utils/binutils';
import * as attributeNames from './constants/attributeNames';
import {getDevicesWithAttributesNotSet, findDeviceByPath} from './utils/device-attributes';

let store = createStore(axsysApp);

let commandResponses = {};

let commandQs = {};

// NB: The name is supposed to be unique for all these commands.
let attributeCommands = [
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


let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnectedToServer(store),
    onDisconnected(store),
    onDataReceived,
    onAttributesDataPublished(store)
);


//console.log(store.getState());


function onDeviceAdded(store) {
    return (device) => {
        connectToDevice(device);
        store.dispatch(addDevice(device));
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


function removeAttributeFromList(attributeName, attributeCommandOptions, devicePath) {
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


function onDataReceived(store) {
    return (data) => {
        //console.log('Data is in the app');
        //console.log(data);

        let returnedString = binUtils.bufferToString(data.buffer);
        let attributeName = null;
        let devicePath = data.path;

        for(let prop in RESPONSES_START_WITH_STRING) {
            if(RESPONSES_START_WITH_STRING.hasOwnProperty(prop)) {
                if(returnedString.startsWith(prop)) {
                    attributeName = RESPONSES_START_WITH_STRING[prop];
                }
            }
        }

        // we only care about the attributes we know of.
        if(attributeName !== null) {
            let deviceAttribute = {
                'path': devicePath,
                'attribute': attributeName,
                'value': returnedString
            };
            store.dispatch(addDataAttributeForDevicePath(deviceAttribute));
            // We need to remove the command from list, which holds all commands awaiting response
            removeAttributeFromList(attributeName, commandResponses, devicePath);
            // Publish data attribute to server
            sendAttributeDataToServer(devicePath, attributeName, returnedString);
        }

    }
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
    return (data) => {
        console.log("Published data");
        console.log(data);
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

function checkForResponsesAndCloseConnection(device, commandResponses) {
    let checker = setInterval(() => {
        let devicePath = device._id;
        let options = {};

        options.path = devicePath;
        if(commandResponses[devicePath].length === 0) {
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
                let deviceCommandQ = new DeviceCommandQueue(path, api, onDataReceived(store));
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

function checkAttributesPeriodically() {
    setInterval(() => {
        let devices = store.getState().devices;
        let deviceAttributes = store.getState().deviceAttributes;
        console.log(devices);
        console.log(deviceAttributes);

        // check for attributes for those devices
        let devicesWithAttributesNotSet = getDevicesWithAttributesNotSet(
                                            devices,
                                            deviceAttributes,
                                            attributeCommands,
                                            api.getServerTime);

        console.log(devicesWithAttributesNotSet);

        for(let devicePath in devicesWithAttributesNotSet) {
            if(devicesWithAttributesNotSet.hasOwnProperty(devicePath)) {
                let attributes = devicesWithAttributesNotSet[devicePath];
                let device = findDeviceByPath(devices, devicePath);
                connectToDevice(device, attributes);
            }
        }

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
                console.log(api.getServerTime());

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
