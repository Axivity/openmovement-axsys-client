/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

import Tooltip from 'rc-tooltip';

import * as attributeNames from '../constants/attributeNames';
import * as actionCreators from '../actions/actionCreators';

const tooltipStyles = {
    height: 20,
    width: 50,
    textAlign: 'center'
};

export default class DevicesListItem extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };

    }


    handleSelect(event) {
        let dispatch = this.props.dispatch;
        if(!this.state.selected) {
            // dispatch device selected!
            dispatch(actionCreators.selectDevice({
                _id: this.props.device._id,
                mountPoint: this.props.device.volumePath
            }));

        } else {
            dispatch(actionCreators.deSelectDevice({
                _id: this.props.device._id,
                mountPoint: this.props.device.volumePath
            }));
        }

        this.setState({
           selected: !this.state.selected
        });
    }


    static getDeviceAttributesForGivenDevicePath(deviceAttributes, path) {
        return deviceAttributes[path];
    }


    static parseBatteryLevel(attributes) {
        if(attributes) {
            let batteryData = attributes[attributeNames.BATTERY];
            if(batteryData) {
                let batteryValue = batteryData.value;
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
        let batteryLevel = this.constructor.parseBatteryLevel(attributes);
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

    static getHardwareAndSoftwareVersions(attributes) {
        if(attributes) {
            let versionsData = attributes[attributeNames.VERSION];
            if(versionsData) {
                let versionsString = versionsData.value;
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


    static presentInSelectedDevices(selectedDevices, deviceId) {
        for(let i=0; i < selectedDevices.length; i++) {
            let dev = selectedDevices[i];
            if(dev._id === deviceId) {
                return true;
            }
        }
        return false;
    }

    static getDeviceStatus(attributes) {
        if(attributes) {
            let currentStatus = attributes[attributeNames.STATUS];
            //console.log(currentStatus);
            //console.log('The status is ' + currentStatus);

            if(currentStatus !== undefined) {
                return currentStatus.value;

            } else {

                return 'Available';
            }


        } else {
            return 'Available';
        }

    }

    handleListItemClicked(ev) {
        let dispatch = this.props.dispatch;
        dispatch(actionCreators.setDetailViewForDevice(this.props.device));
    }


    render() {

        let { dispatch, device, deviceAttributes, selectedDevices } = this.props;

        //console.log(deviceAttributes);

        let attributes = this.constructor.getDeviceAttributesForGivenDevicePath(deviceAttributes, device._id);

        let batteryLevel = this.constructor.parseBatteryLevel(attributes);

        let batteryLevelForUI = (batteryLevel === null) ? 'N/A' : batteryLevel + '%';

        let batteryClasses = "material-icons list-item-icons device-icons";

        let batteryIconNameWithColor = this.getBatteryIconName(attributes);

        let versions = this.constructor.getHardwareAndSoftwareVersions(attributes);

        let status = this.constructor.getDeviceStatus(attributes);

        batteryClasses += " " + batteryIconNameWithColor.className;

        //var iconName = this.state.selected ? 'check_box' : 'check_box_outline_blank';
        let selectIconName = this.constructor.presentInSelectedDevices(selectedDevices, device._id) ? 'check_box' : 'check_box_outline_blank';

        return (
            <div className="row list-item-wrapper list-item-top-spacer list-item-bottom-spacer">

                <div className="large-2 small-2 medium-2 columns list-header-icon-wrapper">
                    <i className="material-icons list-item-header-icon"
                       onClick={this.handleSelect.bind(this)}>
                        {selectIconName}
                    </i>
                </div>

                <div className="large-10 small-10 medium-10 columns list-item-section" onClick={this.handleListItemClicked.bind(this)}>
                    <div className="row">
                        <div className="small-9 large-9 medium-9 columns">
                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-header">{device.serialNumber}</span>
                                    <span className="list-item-main-sub-header">  {status}</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-sub-header"> session: unknown</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-content"> hardware:{versions.hardwareVersion} software:{versions.softwareVersion}</span>
                                </div>
                            </div>

                        </div>
                        <div className="small-3 large-3 medium-3 columns list-item-icons">
                            <span>
                                <small>
                                    <i className="material-icons device-icons standard">usb</i>
                                </small>
                                <small>
                                    <Tooltip
                                        placement="right"
                                        mouseEnterDelay={0}
                                        mouseLeaveDelay={0.1}
                                        overlay={<div style={tooltipStyles}><strong>{batteryLevelForUI}</strong></div>}
                                        transitionName={'rc-tooltip-zoom'}>
                                        <i className={batteryClasses}>
                                            {batteryIconNameWithColor.name}
                                        </i>
                                    </Tooltip>
                                </small>
                            </span>
                        </div>
                    </div>

                    {/*
                    <div className="row">
                        <div className="small-12 large-12 medium-12 columns list-item-bottom-spacer">
                        </div>
                    </div>
                     */}

                </div>

            </div>
        );

    }

}