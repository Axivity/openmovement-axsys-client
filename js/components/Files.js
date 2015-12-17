/**
 * Created by Praveen on 09/12/2015.
 */

import React, { PropTypes, Component } from 'react';
import FilesMaster from './Files.Master';
//import FilesDetail from './Files.Detail';

export default class Files extends Component {

    constructor(props) {
        super(props);
    }

    static hasFiles(files) {
        return files.length > 0;
    }

    render() {

        let {files, selectedFiles, api, dispatch} = this.props;

        if(this.constructor.hasFiles(files)) {
            return(
                <div>
                    <FilesMaster
                        dispatch={dispatch}
                        api={api}
                        files={files}
                        selectedFiles={selectedFiles}
                    />
                    {
                    /*
                     <FilesDetail
                     dispatch={dispatch}
                     detailViewDevice={detailViewDevice}
                     />
                     */
                    }

                </div>
            );

        } else {
            return (
                <div className="large=12 medium-12 small-12 columns">
                    <p className="lead no-devices-main">No files found</p>
                </div>
            );

        }

    }

}