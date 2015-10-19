/**
 * Created by Praveen on 10/09/2015.
 */

import React, { PropTypes, Component } from 'react';
import DeviceListItem from './Devices.List.Item';


export default class DevicesList extends Component {

    render() {

        let { actions, devices } = this.props;
        console.log(devices);

        return (
            <div>
                <div className="row">
                    {/*<hr className="list-item-ruler" /> */}
                    </div>
                    { devices.map((device) => {
                        return (
                            <DeviceListItem
                                key={device._id}
                                device={device}
                                actions={actions}
                            />
                        );
                    }) }

            </div>
        );

    }

}

