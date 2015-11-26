/**
 * Created by Praveen on 23/10/2015.
 */

import React, {Component} from 'react';

import {END_OF_LINE} from '../utils/device-command-queue';
import { getFormattedCurrentDateTime,
         getNextDayAtMidnightFromGiven,
         getMidnightFromNowAndNumberOfDays } from '../utils/time-utils';


export default class DevicesConfigurationForm extends Component {

    static getAccelerometerRateAndRange() {
        return '7,4a';
    }

    static configure() {

    }

    static validate(devices) {
        //devices.filter(
        //);
        return devices;
    }

    submitConfiguration() {
        let {selectedDevices} = this.props;

        let validatedDevices = this.constructor.validate(selectedDevices);

        let currentDateTime = getFormattedCurrentDateTime(),
            timeCmd = "TIME=" + currentDateTime + END_OF_LINE ,
            accelCmd = "RATE=" + this.constructor.getAccelerometerRateAndRange() + END_OF_LINE,
            sessionCmd = "SESSION=1" + END_OF_LINE,
            hibernateCmd = "HIBERNATE " + getNextDayAtMidnightFromGiven() + END_OF_LINE,
            stopCmd = "STOP " + getMidnightFromNowAndNumberOfDays(8) + END_OF_LINE,
            formatCmd = "FORMAT WC" + END_OF_LINE;

        validatedDevices.map(device => this.constructor.configure(device));
    }

    render() {

        let { closeModalFn } = this.props;

        return (
            <div>
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
                                            value="record_immediately"
                                            id="recording_form_record_immediately" />
                                        <label>Interval</label>
                                    </div>

                                    <div className="large-12 columns">
                                        <div className="row">
                                            <div className="large-6 medium-6 small-12 columns">
                                                <label>Start Date
                                                    <input type="text" placeholder="" />
                                                </label>
                                            </div>
                                            <div className="large-6 medium-6 small-12 columns">
                                                <label>Start Time
                                                    <input type="text" placeholder="" />
                                                </label>
                                            </div>

                                            <div className="large-6 medium-6 small-12 columns">
                                                <label>End Date
                                                    <input type="text" placeholder="" />
                                                </label>
                                            </div>
                                            <div className="large-6 medium-6 small-12 columns">
                                                <label>End Time
                                                    <input type="text" placeholder="" />
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
                        <button className="right" onClick={closeModalFn}>Cancel</button>
                        <button className="right" onClick={this.submitConfiguration.bind(this)}>Submit</button>
                    </div>
                </div>
            </div>

            /*
            <div>

                <form>
                    <div className="row">
                        <div className="large-12 columns">
                            <label>Recording Session ID
                                <input type="text" placeholder="" />
                            </label>
                        </div>
                    </div>

                    <fieldset>
                        <legend>Sampling</legend>
                        <div className="row">
                            <div className="large-4 columns">
                                <label>Sampling Freq
                                    <select>
                                        <option value="100">100</option>
                                        <option value="200">200</option>
                                        <option value="500">500</option>
                                        <option value="1000">1000</option>
                                    </select>
                                </label>
                            </div>

                            <div className="large-4 columns">
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



                    <div className="row">
                        <div className="large-6 medium-6 small-12 columns">

                        </div>

                        <div className="large-6 medium-6 small-12 columns">

                        </div>
                    </div>


                </form>

            </div>
            */
        );
    }

}