/**
 * Created by Praveen on 10/09/2015.
 */

'use strict';

import React, { PropTypes, Component } from 'react';
import Notifications from 'react-notifications';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../actions/actionCreators';
import Devices from '../components/Devices';
import Files from '../components/Files';
import TopNavigation from '../components/TopNavigation';
import {CURRENT_VIEW_KEY} from '../reducers/navigation-reducer';

function onNotificationHide(dispatch) {
    return (notification) => {
        dispatch(actionCreators.removeNotification(notification));
    };
}


class App extends Component {
    render() {
        //console.log(this.props);
        let { devices,
            notifications,
            api,
            dispatch,
            deviceAttributes,
            selectedDevices,
            detailViewDevice,
            navigation,
            files,
            selectedFiles } = this.props;

        return (
            <div>
                <Notifications
                    notifications={notifications}
                    onRequestHide={onNotificationHide(dispatch)}
                />
                <TopNavigation
                    dispatch={dispatch}
                    navigation={navigation}
                />
                <div className="ax-ui-content">
                    {(() => {
                        // console.log(navigation[CURRENT_VIEW_KEY]);
                        if(navigation[CURRENT_VIEW_KEY] === 'Files') {
                            return (
                                <Files
                                    files={files}
                                    api={api}
                                    dispatch={dispatch}
                                    selectedFiles={selectedFiles}
                                />
                            );
                        } else {
                            // Default view is devices
                            return (
                                <Devices
                                    devices={devices}
                                    api={api}
                                    dispatch={dispatch}
                                    deviceAttributes={deviceAttributes}
                                    selectedDevices={selectedDevices}
                                    detailViewDevice={detailViewDevice}
                                />
                            )
                        }
                    })()}

                </div>
            </div>
        );
    }

}


function mapStateToProps(state) {
    //console.log(state);
    return {
        devices: state.devices,
        deviceAttributes: state.deviceAttributes,
        selectedDevices: state.selectedDevices,
        detailViewDevice: state.detailViewDevice,
        notifications: state.notifications,
        navigation: state.navigation,
        files: state.files,
        selectedFiles: state.selectedFiles
    };
}

export default connect(mapStateToProps)(App);

