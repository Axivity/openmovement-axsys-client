/**
 * Created by Praveen on 10/09/2015.
 */

import React, { PropTypes, Component } from 'react';
import DeviceListItem from './Devices.List.Item';


export default class DevicesList extends Component {

    render() {

        let { dispatch, devices, deviceAttributes, selectedDevices } = this.props;
        console.log(devices);

        let fixSidesStyle = {
            margin: 0
        };

        return (
            <div className="row" style={fixSidesStyle}>
                <div className="large-12 small-12 medium-12 columns">
                    { devices.map((device) => {
                        return (
                            <DeviceListItem
                                key={device._id}
                                device={device}
                                dispatch={dispatch}
                                deviceAttributes={deviceAttributes}
                                selectedDevices={selectedDevices}
                            />
                        );
                    }) }
                </div>
            </div>
        );
    }
}

