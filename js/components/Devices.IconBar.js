/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';

export default class DevicesIconBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { actions, selectedDevices } = this.props;
        
        return (
            <div className="row">
                <div className="large-12 small-12 medium-12 columns">
                    <div className="icon-bar six-up">
                        <a className="item" role="button">
                            <i className="material-icons">check_box</i>
                        </a>
                        <a className="item disabled">
                            <i className="material-icons">radio_button_checked</i>
                        </a>
                        <a className="item disabled">
                            <i className="material-icons">stop</i>
                        </a>
                        <a className="item disabled">
                            <i className="material-icons">my_location</i>
                        </a>
                        <a className="item disabled">
                            <i className="material-icons">clear</i>
                        </a>
                        <a className="item disabled">
                            <i className="material-icons">file_download</i>
                        </a>
                    </div>
                </div>
            </div>
       );
    }

}