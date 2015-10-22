/**
 * Created by Praveen on 10/09/2015.
 */

'use strict';

import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
//import DevicesList from './../components/Devices.List';
import DevicesMaster from '../components/Devices.Master'


class App extends Component {
    render() {
        console.log(this.props);
        const { devices, dispatch, deviceAttributes, selectedDevices } = this.props;
        //const actions = bindActionCreators(actionCreators, dispatch);
        console.log(deviceAttributes);

        return (
            <DevicesMaster
                devices={devices}
                dispatch={dispatch}
                deviceAttributes={deviceAttributes}
                selectedDevices={selectedDevices}
            />
        );
    }

}


function mapStateToProps(state) {
    console.log(state);
    return {
        devices: state.devices,
        deviceAttributes: state.deviceAttributes,
        selectedDevices: state.selectedDevices
    };
}

export default connect(mapStateToProps)(App);

