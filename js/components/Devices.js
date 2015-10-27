/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';

import DevicesMaster from './Devices.Master';
import DevicesDetail from './Devices.Detail';

export default class Devices extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let {devices, dispatch, deviceAttributes, selectedDevices, detailViewDevice } = this.props;

        return(
            <div>
                <DevicesMaster
                    devices={devices}
                    dispatch={dispatch}
                    deviceAttributes={deviceAttributes}
                    selectedDevices={selectedDevices}
                />
                <DevicesDetail
                    dispatch={dispatch}
                    detailViewDevice={detailViewDevice}
                />
            </div>

        );
    }

}

