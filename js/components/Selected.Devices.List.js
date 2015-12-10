/**
 * Created by Praveen on 10/12/2015.
 */


import React, {Component} from 'react';

import {findDeviceByPath} from '../utils/device-attributes';

import SelectedDevicesListItem from './Selected.Devices.List.Item';

export default class SelectedDevicesList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {selectedDevices, devices, dispatch} = this.props;
        let actualDeviceObjs = selectedDevices.map(device => {
            return findDeviceByPath(devices, device._id);
        });

        return (
            <div>
            {
                actualDeviceObjs.map(
                    (device) => {
                        return (
                            <SelectedDevicesListItem
                                key={device._id}
                                device={device}
                                dispatch={dispatch}
                            />
                        );
                    }
                )
            }
            </div>
        );
    }

}