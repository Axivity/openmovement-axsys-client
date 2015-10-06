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
    console.log(api);

    api.connect(options, (response) => {
        console.log(response);
        if(response === null) { // void method
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
            allDevices.devices.forEach((aDevice) => {
                store.dispatch(addDevice(aDevice));
                getHardwareAndSoftwareVersion(aDevice);
            });
        });
    }
}

React.render(
    <Provider store={store}>
        {() => <App />}
    </Provider>,
    document.getElementById('devicesList')
);





