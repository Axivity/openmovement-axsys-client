/**
 * Created by Praveen on 10/09/2015.
 */

'use strict';

import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
//import DevicesList from './../components/Devices.List';
//import DevicesMaster from '../components/Devices.Master'
import Devices from '../components/Devices';


class App extends Component {
    render() {
        console.log(this.props);
        const { devices, dispatch, deviceAttributes, selectedDevices, detailViewDevice } = this.props;
        //const actions = bindActionCreators(actionCreators, dispatch);
        console.log(deviceAttributes);

        return (
            <Devices
                devices={devices}
                dispatch={dispatch}
                deviceAttributes={deviceAttributes}
                selectedDevices={selectedDevices}
                detailViewDevice={detailViewDevice}
            />
        );
    }

}


function mapStateToProps(state) {
    console.log(state);
    return {
        devices: state.devices,
        deviceAttributes: state.deviceAttributes,
        selectedDevices: state.selectedDevices,
        detailViewDevice: state.detailViewDevice
    };
}

export default connect(mapStateToProps)(App);

