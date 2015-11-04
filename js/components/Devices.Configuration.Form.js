/**
 * Created by Praveen on 23/10/2015.
 */

import React, {Component} from 'react';


export default class DevicesConfigurationForm extends Component {

    render() {

        let { closeModalFn } = this.props;

        return (
            <div>
                <h4>Recording Settings</h4>
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

                    <div className="row">
                        <div className="large-6 medium-6 small-12 columns">
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
                        </div>

                        <div className="large-6 medium-6 small-12 columns">
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
                        </div>
                    </div>

                    {/*
                    <div className="row">

                        <div className="large-6 columns">

                            <label>Choose Your Favorite</label>
                            <input type="radio" name="pokemon" value="Red" id="pokemonRed" /><label>Red</label>
                            <input type="radio" name="pokemon" value="Blue" id="pokemonBlue" /><label>Blue</label>
                        </div>

                        <div className="large-6 columns">
                            <label>Check these out</label>
                            <input id="checkbox1" type="checkbox" /><label>Checkbox 1</label>
                            <input id="checkbox2" type="checkbox" /><label>Checkbox 2</label>
                        </div>

                    </div>

                    <div className="row">
                        <div className="large-12 columns">

                            <label>Textarea Label

                                <textarea placeholder="small-12.columns"></textarea>

                            </label>

                        </div>

                    </div>
                     */}

                </form>
                <div className="row">
                    <div className="large-12 medium-12 small-12 columns">
                        <button className="right" onClick={closeModalFn}>Cancel</button>
                        <button className="right" onClick={closeModalFn}>Submit</button>
                    </div>
                </div>


            </div>
        );
    }

}