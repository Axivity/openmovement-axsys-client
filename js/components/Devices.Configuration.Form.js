/**
 * Created by Praveen on 23/10/2015.
 */

import React, {Component} from 'react';
import Modal from 'react-modal';

import {DeviceCommandQueue, prepareCommandOptions, END_OF_LINE} from '../utils/device-command-queue';
import * as attributeNames from '../constants/attributeNames';
import {findDeviceByPath, sendAttributeDataToServer} from '../utils/device-attributes';

import { getFormattedCurrentDateTime,
         getNextDayAtMidnightFromGiven,
         getMidnightFromNowAndNumberOfDays } from '../utils/time-utils';

import {addNotification} from '../actions/actionCreators';
import SelectedDevicesList from './Selected.Devices.List.js';


const APPEND_SECONDS = ":00";

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const configButtonStyle = {
    margin: "0 1rem 0 0"
};


function getAccelerometerRateAndRange() {
    return '7,4a';
}

function getTimeCommand() {
    return "TIME=" + getFormattedCurrentDateTime() + END_OF_LINE;
}

function getAccelRateAndRangeCommand() {
    return "RATE=" + getAccelerometerRateAndRange() + END_OF_LINE;
}

function getFormatCommand() {
    return "FORMAT=WC" + END_OF_LINE;
}

const CONFIGURATION_COMMANDS = [
    {
        'command': getTimeCommand ,
        'frequency_in_seconds': 0,
        'name': attributeNames.TIME,
        'timeout_in_seconds': 1
    },
    {
        'command': getAccelRateAndRangeCommand,
        'frequency_in_seconds': 0,
        'name': attributeNames.RATE,
        'timeout_in_seconds': 1
    },
    // The following commands need to be pre-parsed
    {
        'command': "SESSION=[Needs Filling up]" + END_OF_LINE ,
        'frequency_in_seconds': 0,
        'name': attributeNames.SESSION,
        'timeout_in_seconds': 1
    },
    {
        'command': "HIBERNATE=[Needs Filling up]" + END_OF_LINE,
        'frequency_in_seconds': 0,
        'name': attributeNames.HIBERNATE,
        'timeout_in_seconds': 1
    },
    {
        'command': "STOP=[Needs Filling up]"  + END_OF_LINE,
        'frequency_in_seconds': 0,
        'name': attributeNames.STOP,
        'timeout_in_seconds': 1
    },
    // Pre parsing stops
    {
        'command': getFormatCommand,
        'frequency_in_seconds': 0,
        'name': attributeNames.FORMAT,
        'timeout_in_seconds': 30
    }
];


export default class DevicesConfigurationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: 'YYYY-MM-DD',
            startTime: 'HH:mm',
            endDate: 'YYYY-MM-DD',
            endTime: 'HH:mm',
            submitModalIsOpen: false,
            sessionId: ""
        };
    }

    preParseCommands(commands) {
        let substitutes = {
            [attributeNames.SESSION]: this.getSessionCommand.bind(this),
            [attributeNames.HIBERNATE]: this.getHibernateCommand.bind(this),
            [attributeNames.STOP]: this.getStopDateTimeCommand.bind(this)
        };

        return commands.map(c => {
            if(substitutes.hasOwnProperty(c.name)) {
                let substitutionFn = substitutes[c.name];
                c.command = substitutionFn();
            }
            return c;
        });

    }

    getSessionCommand() {
        return "SESSION=" + this.state.sessionId + END_OF_LINE;
    }

    getHibernateCommand() {
        return "HIBERNATE=" + this.state.startDate + " " + this.state.startTime + APPEND_SECONDS + END_OF_LINE;
    }

    getStopDateTimeCommand() {
        return "STOP=" + this.state.endDate + " " + this.state.endTime + APPEND_SECONDS + END_OF_LINE;
    }

    openSubmitModal() {
        this.setState({submitModalIsOpen: true});
    }

    closeSubmitModal() {
        this.setState({submitModalIsOpen: false});
    }

    handleStartDateChange(event) {
        this.setState({startDate: event.target.value});
    }

    handleStartTimeChange(event) {
        this.setState({startTime: event.target.value});
    }

    handleEndDateChange(event) {
        this.setState({endDate: event.target.value});
    }

    handleEndTimeChange(event) {
        this.setState({endTime: event.target.value});
    }

    handleSessionIdChange(event) {
        this.setState({sessionId: event.target.value});
    }

    configure(device, api, commands) {
        let { closeModalFn, dispatch } = this.props;
        // close modal windows first
        this.closeSubmitModal();
        closeModalFn();

        // then start configuring - boohahaha!
        let path = device._id;
        let serialNumber = device.serialNumber;
        let parsedCommands = this.preParseCommands(commands);
        console.log(parsedCommands);

        let commandOptions = prepareCommandOptions(path, parsedCommands);
        console.log(commandOptions);

        try {
            let deviceCommandQ = new DeviceCommandQueue(path,
                api,
                commandOptions,
                (data) => {
                    console.log(data);
                    //console.log('Written config command');
                },
                () => {
                    // All commands have completed running and responded.
                    let notification = {
                        id: path + '-config-success-notification',
                        type: 'success',
                        title: serialNumber,
                        message: 'Device Configured',
                        timeOut: 3000

                    };
                    dispatch(addNotification(notification));
                },
                true // write lock
            );
            deviceCommandQ.start();
            console.log('Started config commands Q for ' + path);

        } catch (err) {
            //  push it as notifications...
            console.warn('Another instance of device command queue is running already for device ' + path);
            let notification = {
                id: path + '-config-success-notification',
                type: 'error',
                title: serialNumber,
                message: 'Configuration failed - try again in 10 seconds',
                timeOut: 3000
            };
            dispatch(addNotification(notification));
        }
    }

    static validate(devices) {
        return devices;
    }

    submitConfiguration() {
        let {api, selectedDevices, devices} = this.props;
        let validatedDevices = this.constructor.validate(selectedDevices);
        validatedDevices.map(device => this.configure(
            findDeviceByPath(devices, device._id),
            api,
            CONFIGURATION_COMMANDS));
    }

    render() {

        let { closeModalFn, selectedDevices, devices, dispatch } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="large-3 small-12 medium-3 columns">
                        <div className="row">
                            <div className="large-11 small-12 medium-11 columns">
                                <p className="lead">Selected Devices</p>
                                <SelectedDevicesList
                                    selectedDevices={selectedDevices}
                                    devices={devices}
                                    dispatch={dispatch}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="large-9 small-12 medium-9 columns">
                        <div className="row">
                            <div className="large-12 small-12 medium-12 columns">
                                <p className="lead">Recording Settings <small>
                                    <i className="material-icons">info</i>
                                </small></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="large-12 small-12 medium-12 columns">
                                <form>
                                    <fieldset>
                                        <legend>Subject</legend>
                                        <div className="row">
                                            <div className="large-6 medium-6 small-12 columns">
                                                Code
                                            </div>
                                            <div className="large-6 medium-6 small-12 columns">
                                                <input type="text" placeholder="" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="large-6 medium-6 small-12 columns">
                                                Session ID
                                            </div>
                                            <div className="large-6 medium-6 small-12 columns">
                                                <input
                                                    type="text"
                                                    value={this.state.sessionId}
                                                    onChange={this.handleSessionIdChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset>
                                        <legend>Recording Time</legend>
                                        <div className="row">
                                            <div className="large-12 columns">
                                                <input
                                                    type="radio"
                                                    name="recording_form_record_immediately"
                                                    value="record_immediately"
                                                    id="recording_form_record_immediately" />
                                                <label>Immediately on disconnect</label>
                                            </div>
                                            <div className="large-12 columns">
                                                <input
                                                    type="radio"
                                                    name="recording_form_record_immediately"
                                                    value="record_interval"
                                                    id="recording_form_record_immediately" />
                                                <label>Interval</label>
                                            </div>

                                            <div className="large-12 columns">
                                                <div className="row">
                                                    <div className="large-6 medium-6 small-12 columns">
                                                        <label>Start Date
                                                            <input
                                                                type="text"
                                                                placeholder={this.state.startDate}
                                                                value={this.state.startDate}
                                                                onChange={this.handleStartDateChange.bind(this)}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="large-6 medium-6 small-12 columns">
                                                        <label>Start Time
                                                            <input
                                                                type="text"
                                                                placeholder={this.state.startTime}
                                                                value={this.state.startTime}
                                                                onChange={this.handleStartTimeChange.bind(this)}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="large-6 medium-6 small-12 columns">
                                                        <label>End Date
                                                            <input
                                                                type="text"
                                                                placeholder={this.state.endDate}
                                                                value={this.state.endDate}
                                                                onChange={this.handleEndDateChange.bind(this)}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="large-6 medium-6 small-12 columns">
                                                        <label>End Time
                                                            <input
                                                                type="text"
                                                                placeholder={this.state.endTime}
                                                                value={this.state.endTime}
                                                                onChange={this.handleEndTimeChange.bind(this)}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset>
                                        <legend>
                                            Study
                                        </legend>
                                        <div className="row">
                                            <div className="large-6 medium-6 small-12 columns">
                                                Study Centre
                                            </div>
                                            <div className="large-6 medium-6 small-12 columns">
                                                <input type="text" placeholder="" />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset>
                                        <legend>Sampling</legend>
                                        <div className="row">
                                            <div className="large-6 columns">
                                                <label>Sampling Freqp
                                                    <select>
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="500">500</option>
                                                        <option value="1000">1000</option>
                                                    </select>
                                                </label>
                                            </div>

                                            <div className="large-6 columns">
                                                <label>Range(+/- g)
                                                    <select>
                                                        <option value="2">2</option>
                                                        <option value="4">4</option>
                                                        <option value="8">8</option>
                                                        <option value="16">16</option>
                                                    </select>
                                                </label>
                                            </div>

                                        </div>
                                    </fieldset>

                                </form>
                            </div>
                        </div>

                        <div className="row">
                            <div className="large-12 medium-12 small-12 columns">
                                <a
                                    className="button large"
                                    style={configButtonStyle}
                                    onClick={this.openSubmitModal.bind(this)}>

                                    Submit

                                    <Modal
                                        isOpen={this.state.submitModalIsOpen}
                                        onRequestClose={this.closeSubmitModal.bind(this)}
                                        style={customStyles} >
                                        <p className="lead">Are you sure you want to start recording in selected devices?</p>
                                        <a
                                            className="button"
                                            style={configButtonStyle}
                                            onClick={this.submitConfiguration.bind(this)}
                                        > OK
                                        </a>
                                        <a
                                            className="button"
                                            style={configButtonStyle}
                                            onClick={this.closeSubmitModal.bind(this)}
                                        > Cancel
                                        </a>
                                    </Modal>
                                </a>
                                <a className="button large" style={configButtonStyle} onClick={closeModalFn}>Cancel</a>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        );
    }

}