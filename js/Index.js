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
import { DeviceQueue, CommandOptions } from './utils/device-queue';
import axsysApp from './reducers/reducers';
import {RESPONSES_START_WITH_STRING} from './constants/commandResponseTypes';
import * as binUtils from './utils/binutils';

let store = createStore(axsysApp);

//let connections: Map<string, string>;
let commandQs = {};

// NB: The name is supposed to be unique for all these commands.
let attributeCommands = [
    {
        'command': 'SAMPLE 1\r\n',
        'frequency_in_seconds': 60,
        'name': 'BATTERY'
    },
    {
        'command': 'ID\r\n',
        'frequency_in_seconds': 0,
        'name': 'VERSION'
    }

];


let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnectedToServer(store),
    onDisconnected(store),
    onDataReceived
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


function onDataReceived(store) {
    return (data) => {
        //console.log('Data is in the app');
        //console.log(data);

        let returnedString = binUtils.bufferToString(data.buffer);
        let attributeName = null;
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
                'path': data.path,
                'attribute': attributeName,
                'value': returnedString
            };
            store.dispatch(addDataAttributeForDevicePath(deviceAttribute));
        }

    }
}


function prepareCommandOptions(path) {
    let allCommandOptions = [];
    for(let i=0; i<attributeCommands.length; i++) {
        let options = {
            'command': attributeCommands[i].command,
            'path': path,
            'frequency_in_seconds': attributeCommands[i].frequency_in_seconds,
            'name': attributeCommands[i].name
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


function runCommandContinuously(deviceCommandQ, commandOptions, frequency_in_seconds) {
    var continuousCommandRunner = setInterval(() => {
            deviceCommandQ.addCommand(commandOptions);
        },
        frequency_in_seconds * 1000
    );
}


function connectToDevice(device) {
    let options = {};
    let path = device._id;
    options.path = path;
    console.log('Connecting to device: ' + path);

    // check for attributes in this device


    // if attribute is not set or not updated within frequency range then get that data

    api.connect(options, (response) => {
        if(response) {
            let deviceCommandQ = new DeviceQueue(path, api, onDataReceived(store));
            deviceCommandQ.start();
            commandQs[path] = deviceCommandQ;
            console.log('Started command Q for ' + path);

            let commands = prepareCommandOptions(path);
            for(let i=0; i< commands.length; i++) {
                let frequency = commands[i].options.frequency_in_seconds;
                if (frequency > 0) {
                    // run continuously
                    runCommandContinuously(deviceCommandQ, commands[i], frequency);
                } else {
                    // run once
                    deviceCommandQ.addCommand(commands[i]);
                }
            }

        } else {
            console.warn('Unexpected internal error in connecting to device ' + path);
        }
    });

}


function onConnectedToServer(store) {
    return () => {
        api.getDevices((allDevices) => {
            //console.log(err);
            //console.log(allDevices);

            let err = null;

            if(err) {
                // Need to handle error
                console.error(err);

            } else {
                var devices = allDevices.devices;

                //(function loop(i) {
                //
                //    setTimeout(() => {
                //        console.log(i);
                //        console.log(devices);
                //        let dev = devices[i];
                //        console.log(dev);
                //        getHardwareAndSoftwareVersion(dev);
                //        --i;
                //
                //        if (i >= 0) loop(i);
                //    }, 3000);
                //
                //})(allDevices.devices.length - 1);

                for(let i=0; i<devices.length; i++) {
                    connectToDevice(devices[i]);
                }

                allDevices.devices.forEach((aDevice) => {
                    store.dispatch(addDevice(aDevice));
                });

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
