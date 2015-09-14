/**
 * Created by Praveen on 10/09/2015.
 */

'use strict';

import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import DevicesList from './../components/Devices.List.js';


class App extends Component {
    render() {
        console.log(this.props);
        const { devices, dispatch } = this.props;
        const actions = bindActionCreators(actionCreators, dispatch);

        return (
            <DevicesList
                devices={devices}
                actions={actions}
            />
        );
    }

}


function mapStateToProps(state) {
    console.log(state);
    return {
        devices: state.devices
    };
}

export default connect(mapStateToProps)(App);

