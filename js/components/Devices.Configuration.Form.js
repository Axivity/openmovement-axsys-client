/**
 * Created by Praveen on 23/10/2015.
 */

import React, {Component} from 'react';
import Modal from 'react-modal';

import {DeviceCommandQueue, prepareCommandOptions, END_OF_LINE} from '../utils/device-command-queue';
import * as attributeNames from '../constants/attributeNames';
import {findDeviceByPath} from '../utils/device-attributes';

import { getFormattedCurrentDateTime,
         getNextDayAtMidnightFromGiven,
         getMidnightFromNowAndNumberOfDays } from '../utils/time-utils';

import SelectedDevicesList from './Selected.Devices.List.js';

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


const CONFIGURATION_COMMANDS = [
    {
        'command': getTimeCommand ,
        'frequency_in_seconds': 0,
        'name': attributeNames.TIME
    },
    {
        'command': getAccelRateAndRangeCommand,
        'frequency_in_seconds': 0,
        'name': attributeNames.RATE
    },
    {
        'command': "SESSION 1" + END_OF_LINE ,
        'frequency_in_seconds': 0,
        'name': attributeNames.SESSION
    },
    {
        'command': "HIBERNATE " + getNextDayAtMidnightFromGiven() + END_OF_LINE,
        'frequency_in_seconds': 0,
        'name': attributeNames.HIBERNATE
    },
    {
        'command': "STOP=" + getMidnightFromNowAndNumberOfDays(8) + END_OF_LINE,
        'frequency_in_seconds': 0,
        'name': attributeNames.STOP
    },
    {
        'command': "FORMAT=WC" + END_OF_LINE,
        'frequency_in_seconds': 0,
        'name': attributeNames.FORMAT
    }
];


export default class DevicesConfigurationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: 'DD-MM-YYYY',
            startTime: 'HH:mm',
            endDate: 'DD-MM-YYYY',
            endTime: 'HH:mm',
            submitModalIsOpen: false
        };
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

    static configure(device, api, commands) {
        let { closeModalFn } = this.props;
        // close modal windows first
        this.closeSubmitModal();
        closeModalFn();

        // then start configuring - boohahaha!
        let path = device._id;
        let commandOptions = prepareCommandOptions(path, commands);

        try {
            let deviceCommandQ = new DeviceCommandQueue(path, api, commandOptions, (data) => {
                console.log(data);
                console.log('Done configuring');
            });
            deviceCommandQ.start();
            console.log('Started config commands Q for ' + path);

        } catch (err) {
            // should push it as notifications... to main state
            console.warn('Another instance of device command queue is running already for device ' + path);
        }
    }

    static validate(devices) {
        return devices;
    }

    submitConfiguration() {
        let {api, selectedDevices} = this.props;
        let validatedDevices = this.constructor.validate(selectedDevices);
        validatedDevices.map(device => this.constructor.configure(device, api, CONFIGURATION_COMMANDS));
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
                                        <legend>Sampling</legend>
                                        <div className="row">
                                            <div className="large-6 columns">
                                                <label>Sampling Freq
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
                                        <legend>Subject</legend>
                                        <div className="row">
                                            <div className="large-6 medium-6 small-12 columns">
                                                Code
                                            </div>
                                            <div className="large-6 medium-6 small-12 columns">
                                                <input type="text" placeholder="" />
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