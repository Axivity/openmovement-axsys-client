/**
 * Created by Praveen on 10/09/2015.
 */

import React, { PropTypes, Component } from 'react';
import DeviceListItem from './Devices.List.Item';


export default class DevicesList extends Component {

    render() {

        let { actions, devices, deviceAttributes } = this.props;
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
                                actions={actions}
                                deviceAttributes={deviceAttributes}
                            />
                        );
                    }) }
                </div>
            </div>
        );
    }
}

