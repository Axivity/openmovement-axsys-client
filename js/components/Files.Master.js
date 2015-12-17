/**
 * Created by Praveen on 14/12/2015.
 */
import React, { PropTypes, Component } from 'react';
import FilesIconBar from './Files.IconBar';
import FilesList from './Files.List';

export default class FilesMaster extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {files, api, dispatch, selectedFiles} = this.props;

        return (
            <div className="small-12 medium-4 large-3 columns ax-master-content slide">
                <FilesIconBar
                    dispatch={dispatch}
                    api={api}
                    files={files}
                    selectedFiles={selectedFiles}
                />

                <FilesList
                    dispatch={dispatch}
                    api={api}
                    files={files}
                    selectedFiles={selectedFiles}
                />
            </div>
        );
    }

}