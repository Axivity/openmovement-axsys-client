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
            <div className="small-12 medium-5 large-4 columns ax-master-content slide" data-equalizer-watch>

                <DevicesIconBar
                    devices={devices}
                    actions={actions}
                />

                <!-- list items start -->
                <DevicesList
                    devices={devices}
                    actions={actions}
                />
                <!-- list of items end -->

            </div>
        );
    }

}