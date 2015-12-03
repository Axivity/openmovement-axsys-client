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
    deSelectDevice, removeDetailViewForDevice, DeviceAttributeData } from './actions/actionCreators';
import AXApi from './ax-client';
import { DeviceCommandQueue, CommandOptions } from './utils/device-command-queue';
import axsysApp from './reducers/reducers';
import {checkResponse} from './constants/commandResponseTypes';
import * as binUtils from './utils/binutils';
import * as attributeNames from './constants/attributeNames';
import {DEVICE_METADATA_ATTRIBUTES,
        getAttributesNotSetForDevice,
        findDeviceByPath,
        getKnownAttributes} from './utils/device-attributes';

let store = createStore(axsysApp);

let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnectedToServer(store),
    onDisconnected(store),
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



function onDataReceived() {
    return (data) => {
        let returnedDataAsString = data.string;
        let attributeName = data.response;
        let devicePath = data.path;
        sendAttributeDataToServer(devicePath, attributeName, returnedDataAsString);
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
    }
}


function onAttributesDataPublished(store) {
    return (listOfChanges) => {
        console.log('Published data pushed back');
        for(let i=0; i<listOfChanges.length; i++) {
            let data = listOfChanges[i];
            let attributeValue = data.value.value;
            let pathSize = data.path.split('/').length;

            if(isAnAttributePath(pathSize)) {
                // attributes for a device is published
                let attributeName = checkResponse(attributeValue);
                let path = data.path.split('/')[1].replace(/~1/g, '/');
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
                    let device = data.value;
                    store.dispatch(removeDevice(device));
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


function connectToDevice(device, attributes) {
    let path = device._id;
    let commands = prepareCommandOptions(path, attributes);
    let deviceCommandQ = new DeviceCommandQueue(path, api, commands, onDataReceived());
    deviceCommandQ.start();
    console.log('Started command Q for ' + path);
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
        <App />
    </Provider>,
    document.getElementById('ax-ui-content')
);

/*

 {"event":"ax-attribute-cache-publish",
 "data":{"error":null,
    "data":[{"op":"add","path":"/serial:~1~1COM9~1","value":
        {"port":"\\\\.\\COM9","usbComposite":"USB\\VID_04D8&PID_0057\\CWA17_16221","usb":"USB\\VID_04D8&PID_0057\\8&17860904&0","volumeName":"\\\\?\\Volume{ceab40ac-6c58-11e5-82a0-346895ede8f0}\\","serialString":"CWA17_16221","usbStor":"USBSTOR\\DISK&VEN_AX3&PROD_AX3_MASS_STORAGE&REV_0017\\9&1EE32F56&0&CWA17_16221&0","physicalVolume":"\\Device\\HarddiskVolume18","_id":"serial://COM9/","vidPid":81264727,"serialNumber":16221,"deviceNumber":2,"volumePath":"I:\\"}}],"path":null}}

 */