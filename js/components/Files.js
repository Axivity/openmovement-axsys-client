/**
 * Created by Praveen on 09/12/2015.
 */

import React, { PropTypes, Component } from 'react';
import FilesMaster from './Files.Master';
import FilesDetail from './Files.Detail';

export default class Files extends Component {

    constructor(props) {
        super(props);
    }

    static hasFiles(files) {
        return files.length > 0;
    }

    render() {

        //let {devices, api, dispatch, deviceAttributes, selectedDevices, detailViewDevice } = this.props;
        //
        //if(this.constructor.hasDevices(devices)) {
        //    return(
        //        <div>
        //            <DevicesMaster
        //                devices={devices}
        //                dispatch={dispatch}
        //                api={api}
        //                deviceAttributes={deviceAttributes}
        //                selectedDevices={selectedDevices}
        //            />
        //            <DevicesDetail
        //                dispatch={dispatch}
        //                detailViewDevice={detailViewDevice}
        //            />
        //        </div>
        //    );
        //
        //} else {
        //    return (
        //        <div className="large=12 medium-12 small-12 columns">
        //            <p className="lead no-devices-main">No devices attached</p>
        //        </div>
        //    );
        //
        //}

        return(
            <div className="large=12 medium-12 small-12 columns">
                <p className="lead no-devices-main">No files present</p>
            </div>
        );
    }

}