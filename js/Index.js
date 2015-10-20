/**
 * Created by Praveen on 11/09/2015.
 */
/* system imports */
require("babel/polyfill");

/* third party lib imports */
import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import moment from 'moment';

/* internal imports*/
import App from './containers/AxsysApp';
import { addDevice, removeDevice } from './actions/actionCreators';
import AXApi from './ax-client';
import axsysApp from './reducers/reducers';

let store = createStore(axsysApp);

const WRITTEN = Symbol();
const WRITTEN_AND_READ = Symbol();

const TIMEOUT_IN_SECONDS = 10;
const CHECK_FREQUENCY_IN_SECONDS = 1;

let connections = {};
let attributeCommands = [
    {
        'command': 'BATTERY\r\n',
        'frequency_in_seconds': 60
    },
    {
        'command': 'ID\r\n',
        'frequency_in_seconds': 0
    }

];


let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnected(store),
    onDisconnected(store),
    onDataReceived
);


console.log(store.getState());


function onDeviceAdded(store) {
    return (device) => {
        store.dispatch(addDevice(device));
    }
}


function onDeviceRemoved(store) {
    return (device) => {
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


function onDataReceived(data) {
    console.log('Data is in the app');
    console.log(data);
    connections[data.path] = WRITTEN_AND_READ;
}


function getHardwareAndSoftwareVersion(device) {
    let options = {};
    let path = device._id;
    options.path = path;
    console.log('Getting h/w and s/w version for device: ' + path);

    api.connect(options, (response) => {
        if (response) { // void method
            let writeOptions = {};
            writeOptions.path = path;
            writeOptions.command = 'ID\r\n';
            api.write(writeOptions, (writeResponse) => {
                console.log(writeResponse);
                connections[path] = WRITTEN;
            });
            checkIfDataReceivedAndCloseConnection(path);
        }
    });
}


function checkIfDataReceivedAndCloseConnection(path) {
    let endTime = moment().add(TIMEOUT_IN_SECONDS, 'second');
    var checker = setInterval(() => {
        if (connections[path] === WRITTEN_AND_READ || moment() >= endTime) {
            let options = {};
            options.path = path;
            api.disconnect(options, (response) => {
                console.log('Closed connection');
                console.log(response);
            });
            clearInterval(checker);
        }
    }, CHECK_FREQUENCY_IN_SECONDS);
}


function onConnected(store) {
    return () => {
        api.getDevices((allDevices) => {
            console.log(err);
            console.log(allDevices);

            let err = null;

            if(err) {
                // Need to handle error
                console.error(err);

            } else {
                var devices = allDevices.devices;

                (function loop(i) {

                    setTimeout(() => {
                        console.log(i);
                        console.log(devices);
                        let dev = devices[i];
                        console.log(dev);
                        getHardwareAndSoftwareVersion(dev);
                        --i;

                        if (i >= 0) loop(i);
                    }, 3000);

                })(allDevices.devices.length - 1);

                allDevices.devices.forEach((aDevice) => {
                    store.dispatch(addDevice(aDevice));
                });

            }

        });
    }
}


// Entry point to the views
React.render(
    <Provider store={store}>
        {() => <App />}
    </Provider>,
    document.getElementById('ax-master')
);
