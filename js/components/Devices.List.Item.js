/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

export default class DevicesListItem extends Component {

    render() {

        let { actions, device } = this.props;
        console.log(device);

        return (
            <div className="row list-item">
                <div className="row">
                    <hr className="list-item-ruler" />
                </div>

                <div className="large-2 small-2 medium-2 columns list-header-icon-wrapper">
                    <i className="material-icons list-header-icon">check_box_outline_blank</i>
                </div>

                <div className="large-10 small-10 medium-10 columns">
                    <div className="row clearfix">
                        <h4>
                            {device.doc.serialNumber} <small>COM2345 90% batt</small>
                            <span className="list-item-icons right">
                                <small><i className="material-icons list-item-icons device-icons">usb</i></small>
                                <small><i className="material-icons list-item-icons device-icons 90deg">battery_charging_full</i></small>
                            </span>
                        </h4>

                    </div>
                    <div className="row">
                        Charging...
                    </div>

                </div>

                <div className="row">
                    <hr className="list-item-ruler" />
                </div>
            </div>

        );

    }

}