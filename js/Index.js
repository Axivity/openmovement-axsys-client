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
import { addDevice,
    removeDevice,
    removeDeviceWithAttributes,
    addDataAttributeForDevicePath,
    deSelectDevice,
    removeDetailViewForDevice,
    addFile,
    DeviceAttributeData } from './actions/actionCreators';

import AXApi from './ax-client';
import { DeviceCommandQueue, prepareCommandOptions, CommandOptions } from './utils/device-command-queue';
import axsysApp from './reducers/reducers';
import {checkResponse} from './constants/commandResponseTypes';
import * as binUtils from './utils/binutils';
import * as attributeNames from './constants/attributeNames';
import * as tokenUtils from './utils/token-utils';

import {DEVICE_METADATA_ATTRIBUTES,
        getAttributesNotSetForDevice,
        sendAttributeDataToServer,
        findDeviceByPath,
        getKnownAttributes} from './utils/device-attributes';

let store = createStore(axsysApp);

let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnectedToServer(store),
    onDisconnected(store),
    onAttributesDataPublished(store),
    tokenUtils.getClientTokenFromLocalStorage()
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



function onDataReceived() {
    return (data) => {
        let returnedDataAsString = data.string;
        let attributeName = data.response;
        let devicePath = data.path;
        sendAttributeDataToServer(devicePath, attributeName, returnedDataAsString, api);
    }
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
                Object.keys(devices).map((devicePath) => {
                    let device = devices[devicePath];
                    store.dispatch(addDevice(device));
                    // also update device attributes - known attributes from attributeNames!
                    let attributes = getKnownAttributes(device);
                    attributes.forEach((key) => {
                        let path = device._id;
                        let value = device[key];
                        let deviceAttribute = new DeviceAttributeData(path, key, value);
                        store.dispatch(addDataAttributeForDevicePath(deviceAttribute));
                    });
                });

                checkAttributesPeriodically();
            }
        });

        api.getFiles((files) => {
            console.log(files);
            files.forEach((file) => {
               store.dispatch(addFile(file));
            });
        });
    }
}

function constructDevicePathWithForwardSlashSeparator(path) {
    // param: "/serial:~1~1COM4~1" or "/serial:~1~1COM4~1/version"
    return path.split('/')[1].replace(/~1/g, '/');
}

function onAttributesDataPublished(store) {
    return (listOfChanges) => {
        console.log('Published data pushed back');
        console.log(listOfChanges);
        for(let i=0; i<listOfChanges.length; i++) {
            let data = listOfChanges[i];
            let pathSize = data.path.split('/').length;

            if(isAnAttributePath(pathSize)) {
                // attributes for a device is published
                let attributeValue = data.value.value;
                let attributeName = checkResponse(attributeValue);
                let path = constructDevicePathWithForwardSlashSeparator(data.path);
                if(attributeName != null) {
                    let deviceAttribute = new DeviceAttributeData(path, attributeName, data.value);
                    store.dispatch(addDataAttributeForDevicePath(deviceAttribute));
                }

            } else if(isADevicePath(pathSize)) {
                // device added or removed is published
                if(data.op === 'add') {
                    let device = data.value;
                    store.dispatch(addDevice(device));

                } else {
                    let devicePath = constructDevicePathWithForwardSlashSeparator(data.path);
                    store.dispatch(removeDeviceWithAttributes(devicePath));
                }

            }

        }
    }
}

function isAnAttributePath(pathSize) {
    return pathSize > 2;
}

function isADevicePath(pathSize) {
    return pathSize === 2;
}


function connectToDevice(device, attributes) {
    let path = device._id;
    let commands = prepareCommandOptions(path, attributes);
    try {
        let deviceCommandQ = new DeviceCommandQueue(path, api, commands, onDataReceived());
        deviceCommandQ.start();
        console.log('Started command Q for ' + path);

    } catch (err){
        console.warn('Could not run device queue ' + err);
    }


}


function runCommandsToGetAttributes(device, attributesNotSetForDevice) {
    console.log(attributesNotSetForDevice);
    let devicePath = device._id;
    let attributesNotSet = attributesNotSetForDevice[devicePath];
    if(attributesNotSet.length > 0) {
        connectToDevice(device, attributesNotSet);
    } else {
        console.log('All attributes are up to date');
    }
}


function setupDevice(device) {
    let deviceAttributes = store.getState().deviceAttributes;
    // check for attributes for those devices
    let deviceWithAttributesNotSet = getAttributesNotSetForDevice(
                                            device,
                                            deviceAttributes,
                                            DEVICE_METADATA_ATTRIBUTES,
                                            api.getServerTimeFunction());

    runCommandsToGetAttributes(device, deviceWithAttributesNotSet);
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


// Entry point to the views
ReactDOM.render(
    <Provider store={store}>
        <App api={api} />
    </Provider>,
    document.getElementById('ax-ui-content')
);

