/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';

export default class DevicesIconBar extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        let { devices, actions } = this.props;
        
        return (
            <div className="row">
                <div className="large-12 small-12 medium-12 columns">
                    <ul className="button-group radius even-6">
                        <li>
                            <a href="#"
                               className="button list-item-icons-wrapper has-tip"
                               data-tooltip
                               aria-haspopup="true"
                               title="Select All">
                                <i className="material-icons list-item-icon">check_box_outline_blank</i>

                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="button disabled list-item-icons-wrapper has-tip"
                               data-tooltip
                               aria-haspopup="true"
                               title="Configure recording">
                                <i className="material-icons list-item-icon">radio_button_checked</i>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="button disabled list-item-icons-wrapper has-tip"
                               data-tooltip
                               aria-haspopup="true"
                               title="Stop Recording">
                                <i className="material-icons list-item-icon">stop</i>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="button disabled list-item-icons-wrapper has-tip"
                               data-tooltip
                               aria-haspopup="true"
                               title="Identify">
                                <i className="material-icons list-item-icon">my_location</i>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="button disabled list-item-icons-wrapper has-tip"
                               data-tooltip
                               aria-haspopup="true"
                               title="Clear Data">
                                <i className="material-icons list-item-icon">clear</i>
                            </a>
                        </li>
                        <li>
                            <a href="#"
                               className="button disabled list-item-icons-wrapper has-tip"
                               data-tooltip
                               aria-haspopup="true"
                               title="Download datafile">
                                <i className="material-icons list-item-icon">file_download</i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
       );
    }



}