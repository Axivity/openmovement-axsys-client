/**
 * Created by Praveen on 10/09/2015.
 */

'use strict';

import React, { PropTypes, Component } from 'react';
import Notifications from 'react-notifications';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../actions/actionCreators';
import Devices from '../components/Devices';


let notifications = [
    {
        id: 1,
        title: 'Info',
        message: 'Upgraded system software version',
        timeOut: 1000,
        type: 'info'

    },
    {
        id: 2,
        title: 'Success',
        message: '14666 - Device Configured ',
        timeOut: 2000,
        type: 'success'
    },
    {
        id: 3,
        title: 'Success',
        message: '16746 - Device Configured ',
        timeOut: 1000,
        type: 'success'
    },
    {
        id: 4,
        title: 'Warning',
        message: '17383 - Device is already stopped ',
        timeOut: 3000,
        type: 'warning'
    },
    {
        id: 5,
        title: 'Error',
        message: '17383 - Device cannot be reached, please plug it out and try again',
        timeOut: 1000,
        type: 'error'
    }

];

let handleRequestHide = (notification) => {
    notifications = notifications.filter(n => n.id !== notification.id);
};

class App extends Component {
    render() {
        //console.log(this.props);
        const { devices, api, dispatch, deviceAttributes, selectedDevices, detailViewDevice } = this.props;
        //const actions = bindActionCreators(actionCreators, dispatch);
        //console.log(deviceAttributes);

        return (
            <div>
                <Notifications
                    notifications={notifications}
                    onRequestHide={handleRequestHide}
                />
                <Devices
                    devices={devices}
                    api={api}
                    dispatch={dispatch}
                    deviceAttributes={deviceAttributes}
                    selectedDevices={selectedDevices}
                    detailViewDevice={detailViewDevice}
                />
            </div>
        );
    }

}


function mapStateToProps(state) {
    //console.log(state);
    return {
        devices: state.devices,
        deviceAttributes: state.deviceAttributes,
        selectedDevices: state.selectedDevices,
        detailViewDevice: state.detailViewDevice
    };
}

export default connect(mapStateToProps)(App);

