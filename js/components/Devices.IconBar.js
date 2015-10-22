/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';

import * as actionCreators from '../actions/actionCreators';

export default class DevicesIconBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAll: false
        };
    }

    isSelected() {
        if(this.props.selectedDevices) {
            // selectedDevices property set in state
            return this.props.selectedDevices.length > 0;

        } else {
            // selectedDevices property not set yet.
            return false;
        }
    }

    handleSelectAll(event) {
        let dispatch = this.props.dispatch;
        let devices = this.props.devices;
        if(!this.state.selectedAll) {
            devices.map(device => dispatch(actionCreators.selectDevice({
                _id: device._id,
                mountPoint: device.volumePath
            })));

        } else {
            devices.map(device => dispatch(actionCreators.deSelectDevice({
                _id: device._id,
                mountPoint: device.volumePath
            })));
        }

        this.setState({
            selectedAll: !this.state.selectedAll
        });
    }

    areAllDevicesSelected(selectedDevices, devices) {
        return (devices.length === selectedDevices.length);
    }


    render() {
        let { actions, selectedDevices, devices } = this.props;

        let shouldEnableIcons = this.isSelected();

        let iconKlassNames = 'item has-tip';

        iconKlassNames += shouldEnableIcons ? '' : ' disabled';

        let checkBoxIconName = this.areAllDevicesSelected(selectedDevices, devices) ? 'check_box' : 'check_box_outline_blank';
        
        return (
            <div className="row">
                <div className="large-12 small-12 medium-12 columns">
                    <div className="icon-bar six-up">
                        <a className="item has-tip"
                           role="button"
                           data-tooltip
                           aria-haspopup="true"
                           title="Select All"
                            onClick={this.handleSelectAll.bind(this)}>
                            <i className="material-icons">{checkBoxIconName}</i>
                        </a>
                        <a className={iconKlassNames}
                           data-tooltip
                           aria-haspopup="true"
                           data-reveal-id="myModal"
                           title="Record">
                            <i className="material-icons">radio_button_checked</i>
                        </a>
                        <a className={iconKlassNames}
                           data-tooltip
                           aria-haspopup="true"
                           title="Stop Recording">
                            <i className="material-icons">stop</i>
                        </a>
                        <a className={iconKlassNames}
                           data-tooltip
                           aria-haspopup="true"
                           title="Identify">
                            <i className="material-icons">my_location</i>
                        </a>
                        <a className={iconKlassNames}
                           data-tooltip
                           aria-haspopup="true"
                           title="Clear data">
                            <i className="material-icons">clear</i>
                        </a>
                        <a className={iconKlassNames}
                           data-tooltip
                           aria-haspopup="true"
                           title="Download data">
                            <i className="material-icons">file_download</i>
                        </a>
                    </div>
                </div>
            </div>
       );
    }

}