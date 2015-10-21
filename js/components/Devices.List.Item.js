/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

import * as attributeNames from '../constants/attributeNames';

export default class DevicesListItem extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };

    }


    handleSelect(event) {
        this.setState({
           selected: !this.state.selected
        });
    }


    getDeviceAttributesForGivenDevicePath(deviceAttributes, path) {
        return deviceAttributes[path];
    }


    parseBatteryLevel(attributes) {
        if(attributes) {
            let batteryValue = attributes[attributeNames.BATTERY];
            if(batteryValue) {
                return parseInt(batteryValue.split(',')[3]);

            } else {
                // don't have battery property set
                return null;
            }

        } else {
            // don't have any attributes yet for device path
            return null;
        }

    }


    getBatteryIconName(attributes) {
        let batteryLevel = this.parseBatteryLevel(attributes);
        if(batteryLevel) {
            if(batteryLevel <= 50) {
                return {
                    name: 'battery_alert',
                    className: 'red'
                };

            } else if(batteryLevel > 50 && batteryLevel <= 80) {
                return {
                    name: 'battery_charging_full',
                    className: 'orange'
                };

            } else if(batteryLevel < 95) {
                return {
                    name: 'battery_charging_full',
                    className: 'green'
                };

            } else {
                // battery > 95% is considered full - TODO: Check with @Dan
                return {
                    name: 'battery_full',
                    className: 'green'
                }
            }

        } else {
            return {
                name: 'battery_unknown',
                className: 'grey'
            };
        }
    }

    getHardwareAndSoftwareVersions(attributes) {
        if(attributes) {
            let versionsString = attributes[attributeNames.VERSION];
            if(versionsString) {
                return {
                    hardwareVersion: versionsString.split(',')[1],
                    softwareVersion: versionsString.split(',')[2]
                }
            } else {
                return {
                    hardwareVersion: 'N/A',
                    softwareVersion: 'N/A'
                }
            }
        } else {
            return {
                hardwareVersion: 'N/A',
                softwareVersion: 'N/A'
            }
        }
    }


    render() {

        let { action, device, deviceAttributes } = this.props;

        console.log(deviceAttributes);

        let attributes = this.getDeviceAttributesForGivenDevicePath(deviceAttributes, device._id);

        let batteryClasses = "material-icons list-item-icons device-icons";

        let batteryIconNameWithColor = this.getBatteryIconName(attributes);

        let versions = this.getHardwareAndSoftwareVersions(attributes);

        batteryClasses += " " + batteryIconNameWithColor.className;

        var iconName = this.state.selected ? 'check_box' : 'check_box_outline_blank';

        return (
            <div className="row list-item-wrapper list-item-top-spacer">

                <div className="large-2 small-2 medium-2 columns list-header-icon-wrapper">
                    <i className="material-icons list-item-header-icon"
                       onClick={this.handleSelect.bind(this)}>
                        {iconName}
                    </i>
                </div>

                <div className="large-10 small-10 medium-10 columns">
                    <div className="row clearfix">
                        <h4>
                            {device.serialNumber} <small>Charging</small>
                            <span className="list-item-icons right">
                                <small>
                                    <i className="material-icons device-icons standard">usb</i>
                                </small>
                                <small>
                                    <i className={batteryClasses}>
                                        {batteryIconNameWithColor.name}
                                    </i>
                                </small>
                            </span>

                        </h4>
                    </div>

                    <div className="row list-item-bottom-spacer">
                        <small>Hardware:{versions.hardwareVersion} Software:{versions.softwareVersion}</small><br/>
                        {/*<small>{device._id}</small>*/}
                    </div>

                </div>

            </div>
        );

    }

}