/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

export default class DevicesListItem extends Component {

    render() {

        let { actions, device } = this.props;
        console.log(device);

        return (
            <div className="row">
                <div className="large-3 small-3 medium-3 columns list-header-icon">
                    <i className="fi-usb"></i>
                </div>

                <div className="large-9 small-9 medium-9 columns">
                    <div className="row">

                        {device.doc.serialNumber}
                        <span className="list-item-icons">
                            <a href=""><i className="fi-target-two list-item-icon"></i></a>
                            <a href=""><i className="fi-info list-item-icon"></i></a>
                            <a href=""><i className="fi-battery-half list-item-icon"></i></a>
                        </span>
                    </div>
                    <div className="row">
                        {device.doc.port}
                    </div>
                    <div className="row">
                        <hr className="list-item-ruler" />
                    </div>

                </div>
            </div>
        );

    }

}