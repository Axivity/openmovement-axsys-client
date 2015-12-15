/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';
import Tooltip from 'rc-tooltip';
import Modal from 'react-modal';

import DevicesConfigurationForm from './Devices.Configuration.Form.js';
import * as actionCreators from '../actions/actionCreators';
import SelectedDevicesList from './Selected.Devices.List';

const modalButtonStyle = {
    margin: "0 1rem 0 0"
};

const downloadModalStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const customStyles = {
    //content : {
    //    top                   : '50%',
    //    left                  : '50%',
    //    right                 : 'auto',
    //    bottom                : 'auto',
    //    marginRight           : '-50%',
    //    transform             : 'translate(-50%, -50%)'
    //}
    overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)'
    },
    content : {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px'
    }

};

const tooltipStyles = {
    height: 20,
    width: 100,
    textAlign: 'center'
};

export default class DevicesIconBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAll: false,
            configModalIsOpen: false,
            downloadModalIsOpen: false
        };
    }

    openConfigModal() {
        this.setState({configModalIsOpen: true});
    }

    closeConfigModal() {
        this.setState({configModalIsOpen: false});
    }

    openDownloadModal() {
        this.setState({downloadModalIsOpen: true});
    }

    closeDownloadModal() {
        this.setState({downloadModalIsOpen: false});
    }

    isSelected() {
        if(this.props.selectedDevices) {
            // selectedDevices property set in state
            return this.props.selectedDevices.length > 0;

        } else {
            // selectedDevices property not set yet.
            return false;
        }
    }

    downloadFiles() {
        let {selectedDevices} = this.props;
        console.log(selectedDevices);
    }

    handleSelectAll(event) {
        let dispatch = this.props.dispatch;
        let devices = this.props.devices;
        if(!this.state.selectedAll) {
            devices.map(device => dispatch(actionCreators.selectDevice({
                _id: device._id,
                mountPoint: device.volumePath
            })));

        } else {
            devices.map(device => dispatch(actionCreators.deSelectDevice({
                _id: device._id,
                mountPoint: device.volumePath
            })));
        }

        this.setState({
            selectedAll: !this.state.selectedAll
        });
    }

    areAllDevicesSelected(selectedDevices, devices) {
        return (devices.length > 0 && devices.length === selectedDevices.length);
    }


    render() {
        let { actions, api, selectedDevices, devices, dispatch } = this.props;

        let shouldEnableIcons = this.isSelected();

        let iconKlassNames = 'item ';

        iconKlassNames += shouldEnableIcons ? '' : ' disabled';

        let checkBoxIconName = this.areAllDevicesSelected(selectedDevices, devices) ? 'check_box' : 'check_box_outline_blank';
        
        return (
            <div className="row">
                <div className="large-12 small-12 medium-12 columns ax-icon-bar-adjust-height">
                    <div className="icon-bar six-up">
                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Select All</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>
                            <a className="item"
                                role="button"
                                onClick={this.handleSelectAll.bind(this)}>
                                <i className="material-icons">{checkBoxIconName}</i>
                            </a>
                        </Tooltip>

                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Record</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>

                            <a className={iconKlassNames}
                               onClick={this.openConfigModal.bind(this)}>
                                <i className="material-icons">radio_button_checked</i>
                                <Modal
                                    isOpen={this.state.configModalIsOpen}
                                    onRequestClose={this.closeConfigModal.bind(this)}
                                    style={customStyles} >

                                     <DevicesConfigurationForm
                                         api={api}
                                         closeModalFn={this.closeConfigModal.bind(this)}
                                         selectedDevices={selectedDevices}
                                         devices={devices}
                                         dispatch={dispatch}
                                     />

                                </Modal>
                            </a>
                        </Tooltip>

                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Stop Recording</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>

                            <a className={iconKlassNames}>
                                <i className="material-icons">stop</i>
                            </a>

                        </Tooltip>

                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Identify</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>

                            <a className={iconKlassNames}>
                                <i className="material-icons">my_location</i>
                            </a>
                        </Tooltip>

                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Clear data</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>

                            <a className={iconKlassNames}>
                                <i className="material-icons">clear</i>
                            </a>
                        </Tooltip>

                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Download data</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>

                            <a
                                className={iconKlassNames}
                                onClick={this.openDownloadModal.bind(this)}>
                                <i className="material-icons">file_download</i>
                                <Modal
                                    isOpen={this.state.downloadModalIsOpen}
                                    onRequestClose={this.closeDownloadModal.bind(this)}
                                    style={downloadModalStyles} >
                                    <p className="lead">Are you sure you want to start downloading data from selected devices?</p>
                                    <SelectedDevicesList
                                        selectedDevices={selectedDevices}
                                        devices={devices}
                                        dispatch={dispatch}
                                    />
                                    <a
                                        className="button"
                                        style={modalButtonStyle}
                                        onClick={this.downloadFiles.bind(this)}
                                    > OK
                                    </a>
                                    <a
                                        className="button"
                                        style={modalButtonStyle}
                                        onClick={this.closeDownloadModal.bind(this)}
                                    > Cancel
                                    </a>

                                </Modal>
                            </a>
                        </Tooltip>
                    </div>
                </div>
            </div>

       );
    }

}