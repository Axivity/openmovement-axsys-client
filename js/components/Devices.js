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

    static hasDevices(devices) {
        return devices.length > 0;
    }

    render() {

        let {devices, api, dispatch, deviceAttributes, selectedDevices, detailViewDevice } = this.props;
        if(this.constructor.hasDevices(devices)) {
            return(
                <div>
                    <DevicesMaster
                        devices={devices}
                        dispatch={dispatch}
                        api={api}
                        deviceAttributes={deviceAttributes}
                        selectedDevices={selectedDevices}
                    />
                    <DevicesDetail
                        dispatch={dispatch}
                        detailViewDevice={detailViewDevice}
                        deviceAttributes={deviceAttributes}
                    />
                </div>
            );

        } else {
            return (
              <div className="large=12 medium-12 small-12 columns">
                  <p className="lead no-devices-main">No devices attached</p>
              </div>
            );

        }

    }

}

