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
        let {devices, dispatch, deviceAttributes, selectedDevices} = this.props;

        return (
            <div className="small-12 medium-4 large-3 columns ax-master-content slide">
                <DevicesIconBar
                    dispatch={dispatch}
                    selectedDevices={selectedDevices}
                    devices={devices}
                />
                <DevicesList
                    devices={devices}
                    dispatch={dispatch}
                    deviceAttributes={deviceAttributes}
                    selectedDevices={selectedDevices}
                />
            </div>
        );
    }

}