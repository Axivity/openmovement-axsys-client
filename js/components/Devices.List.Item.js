/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

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

    render() {

        let { action, device } = this.props;

        var iconName = this.state.selected ? 'check_box' : 'check_box_outline_blank';

        return (
            <div className="list-item-wrapper">
                <div>
                    <div className="row list-item">
                        <div className="large-2 small-2 medium-2 columns list-header-icon-wrapper">
                            <i className="material-icons list-item-header-icon"
                               onClick={this.handleSelect.bind(this)}>
                                {iconName}
                            </i>
                        </div>

                        <div className="large-10 small-10 medium-10 columns">
                            <div className="row clearfix">
                                <h4>
                                    {device.serialNumber} <small>{device._id}</small>
                                    <span className="list-item-icons right">
                                        <small>
                                            <i className="material-icons list-item-icons device-icons">usb</i>
                                        </small>
                                        <small>
                                            <i className="material-icons list-item-icons device-icons 90deg">
                                                battery_charging_full
                                            </i>
                                        </small>
                                    </span>
                                </h4>
                            </div>

                            <div className="row list-item-bottom-spacer">
                                Charging...
                            </div>

                        </div>

                    </div>

                </div>
                {/*
                <div className="row">
                    <hr className="list-item-ruler" />
                </div>
                */}

            </div>
        );

    }

}