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
import { addDevice } from './actions/actionCreators';
import AXApi from './ax-client';
import axsysApp from './reducers/reducers';

console.log(axsysApp);

let api = new AXApi();
let store = createStore(axsysApp);
console.log(store.getState());

api.getDevices((allDevices) => {
    console.log(allDevices);
    allDevices.devices.forEach((aDevice) => {
        store.dispatch(addDevice(aDevice));
    });

    React.render(
        <Provider store={store}>
            {() => <App />}
        </Provider>,
        document.getElementById('devicesList')
    );
});






