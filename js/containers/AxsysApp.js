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

function onNotificationHide(dispatch) {
    return (notification) => {
        dispatch(actionCreators.removeNotification(notification));
    };
}


class App extends Component {
    render() {
        //console.log(this.props);
        let { devices,
            notifications,
            api,
            dispatch,
            deviceAttributes,
            selectedDevices,
            detailViewDevice } = this.props;

        return (
            <div>
                <Notifications
                    notifications={notifications}
                    onRequestHide={onNotificationHide(dispatch)}
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
        detailViewDevice: state.detailViewDevice,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(App);

