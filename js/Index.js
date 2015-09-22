/**
 * Created by Praveen on 11/09/2015.
 */
/* system imports */
require("babel/polyfill");

/* third party lib imports */
import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

/* internal imports*/
import App from './containers/AxsysApp';
import { addDevice, removeDevice } from './actions/actionCreators';
import AXApi from './ax-client';
import axsysApp from './reducers/reducers';

let store = createStore(axsysApp);

let api = new AXApi(
    onDeviceAdded(store),
    onDeviceRemoved(store),
    onConnected(store),
    onDisconnected(store)
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

function getHardwareAndSoftwareVersion(device) {
    let options = {};
    options.path = device._id;
    console.log(api);
    api.connect(options, (response) => {
        console.log(response);
    });
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





