/**
 * Created by Praveen on 09/12/2015.
 */


import React, { PropTypes, Component } from 'react';
import FilesListItem from './Files.List.Item';


export default class FilesList extends Component {

    render() {

        let { selectedFiles, dispatch, files } = this.props;

        let fixSidesStyle = {
            margin: 0
        };

        return (
            <div className="row" style={fixSidesStyle}>
                <div className="large-12 small-12 medium-12 columns">
                    { files.map((file) => {
                        return (
                            <FilesListItem
                                key={file.name}
                                file={file}
                                dispatch={dispatch}
                                selectedFiles={selectedFiles}
                            />
                        );
                    }) }
                </div>
            </div>
        );
    }
}
