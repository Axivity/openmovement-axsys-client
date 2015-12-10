/**
 * Created by Praveen on 10/12/2015.
 */

import React, {Component} from 'react';

import * as actionCreators from '../actions/actionCreators';

export default class SelectedDevicesListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: true
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

    render() {
        let {device, key, dispatch} = this.props;

        return (
            <div key={key} className="row">
                <div className="large-2 small-4 medium-2 columns">
                    <i
                        className="material-icons list-item-header-icon"
                        onClick={this.handleSelect.bind(this)}
                    >delete</i>
                </div>
                <div className="large-10 small-8 medium-10 columns selected-device-name">
                    {device.serialNumber}
                </div>
            </div>
        );
    }

}