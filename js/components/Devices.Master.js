/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';
import DevicesIconBar from './Devices.IconBar';
import DevicesList from './Devices.List';

export default class DevicesMaster extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {devices, actions} = this.props;

        return (
            
            <DevicesList
                devices={devices}
                actions={actions}
            />
        );
    }

}