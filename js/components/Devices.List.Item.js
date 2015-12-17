/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

import Tooltip from 'rc-tooltip';

import * as attributeNames from '../constants/attributeNames';
import * as actionCreators from '../actions/actionCreators';

import {currentTimeInRange} from '../utils/time-utils';

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

    static checkRecordingProgress(recording) {
        if (recording !== "-") {
            let [start, end] = recording.split('-');
            return currentTimeInRange(start, end);

        } else {
            return null;
        }
    }


    static getRecordingProgressLabelClass(recording) {
        let progress = this.constructor.checkRecordingProgress(recording);
        if(progress === 'N/A') {
            return "secondary label";

        } else {
            return progress ? "success label" : "label";
        }

    }


    static getRecordingForDevice(attributes) {
        if(attributes) {
            let recordingStartTime = attributes[attributeNames.HIBERNATE];
            let recordingStopTime = attributes[attributeNames.STOP];

            if(recordingStartTime !== undefined && recordingStopTime !== undefined) {
                let start = recordingStartTime.value;
                let stop = recordingStopTime.value;

                let [startDate, startTime] = start.split('=')[1].split(',');
                let [stopDate, stopTime] = stop.split('=')[1].split(',');
                return startDate + " " + startTime + " - " + stopDate + " " + stopTime;

            } else {

                return "-";
            }

        } else {
            return "-";
        }

    }

    static getSessionId(attributes) {
        if(attributes) {
            let sessionId = attributes[attributeNames.SESSION];
            if(sessionId !== undefined) {
                return sessionId.value.split('=')[1];

            } else {
                return "Unknown";
            }

        } else {
            return "Unknown";
        }

    }

    handleListItemClicked(ev) {
        let dispatch = this.props.dispatch;
        dispatch(actionCreators.setDetailViewForDevice(this.props.device));
    }


    render() {

        let { dispatch, device, deviceAttributes, selectedDevices, api } = this.props;

        let attributes = this.constructor.getDeviceAttributesForGivenDevicePath(deviceAttributes, device._id);

        let batteryLevel = this.constructor.parseBatteryLevel(attributes);

        let batteryLevelForUI = (batteryLevel === null) ? 'N/A' : batteryLevel + '%';

        let batteryClasses = "material-icons list-item-icons device-icons";

        let batteryIconNameWithColor = this.getBatteryIconName(attributes);

        let status = this.constructor.getDeviceStatus(attributes);

        let recording = this.constructor.getRecordingForDevice(attributes);

        let session = this.constructor.getSessionId(attributes);


        let progress = this.constructor.checkRecordingProgress(recording);

        //let dataFile = this.constructor.hasDataFile();

        batteryClasses += " " + batteryIconNameWithColor.className;

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
                                    <div className="row">
                                        <div className="large-3 small-12 medium-3 columns">
                                            <span className="list-item-main-header">{device.serialNumber}</span>
                                        </div>

                                        <div className="large-9 small-12 medium-9 columns">
                                            {
                                                (() => {
                                                    if(progress === null) {
                                                        return <span className="list-item-main-content secondary label">Unknown</span>;

                                                    } else {
                                                        if(progress) {
                                                            return <span className="list-item-main-content success label">In Progress</span>;

                                                        } else {

                                                            return <span className="list-item-main-content label">Not In Progress</span>;
                                                        }

                                                    }
                                                })()
                                            }


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-sub-header">  {status}</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-sub-header"> Session: {session}</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-content"> Recording: {recording}</span>
                                </div>
                            </div>

                        </div>
                        <div className="small-3 large-3 medium-3 columns list-item-icons">
                            <span>
                                <small>
                                    {
                                        (() => {
                                            if(device.hasFile) {
                                                return (
                                                    <span className="list-item-main-content">
                                                        <i className="material-icons device-icons standard">lock_outline</i>
                                                    </span>
                                                );

                                            } else {
                                                return (
                                                    <span className="list-item-main-content">
                                                        <i className="material-icons device-icons standard">lock_open</i>
                                                    </span>
                                                );
                                            }
                                        })()
                                    }

                                </small>
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

                </div>

            </div>
        );

    }

}