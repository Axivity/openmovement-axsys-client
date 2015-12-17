/**
 * Created by Praveen on 09/12/2015.
 */


/**
 * Created by Praveen on 14/09/2015.
 */
import React, { PropTypes, Component } from 'react';

import Tooltip from 'rc-tooltip';

import * as attributeNames from '../constants/attributeNames';
import * as actionCreators from '../actions/actionCreators';


const fileIconStyle = {
    fontSize: "1.0rem",
    color: "#343434",
    paddingLeft: "0.5rem"
};

export default class FilesListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };

    }


    handleSelect(event) {
        let {dispatch} = this.props;
        if(!this.state.selected) {
            // dispatch device selected!
            dispatch(actionCreators.selectFile({
                name: this.props.file.name
            }));

        } else {
            dispatch(actionCreators.deSelectFile({
                name: this.props.file.name
            }));
        }

        this.setState({
            selected: !this.state.selected
        });
    }


    static presentInSelectedFiles(selectedFiles, key) {
        for(let i=0; i < selectedFiles.length; i++) {
            let file = selectedFiles[i];
            if(file.name === key) {
                return true;
            }
        }
        return false;
    }


    handleListItemClicked(ev) {
        let {file, dispatch} = this.props;
        dispatch(actionCreators.setDetailViewForFile(file));
    }


    handleDelete(fileName) {
        console.log('Deleting file ' + fileName);
    }


    render() {

        let { dispatch, file, selectedFiles } = this.props;

        let selectIconName = this.constructor.presentInSelectedFiles(selectedFiles, file.name) ? 'check_box' : 'check_box_outline_blank';

        return (
            <div className="row list-item-wrapper list-item-top-spacer list-item-bottom-spacer">

                <div className="large-2 small-2 medium-2 columns list-header-icon-wrapper">
                    <i className="material-icons list-item-header-icon" onClick={this.handleSelect.bind(this)}>
                        {selectIconName}
                    </i>
                </div>

                <div className="large-10 small-10 medium-10 columns list-item-section">
                    <div className="row">
                        <div className="small-9 large-9 medium-9 columns">
                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-header">{file.name}</span>
                                    <small>
                                        <i className="material-icons device-icons" style={fileIconStyle}>insert_drive_file</i>
                                    </small>
                                </div>
                            </div>

                            <div className="row">
                                <div className="small-12 large-12 medium-12 columns">
                                    <span className="list-item-main-content"> Modified: {file.modifiedTime}, Size: {file.sizeInBytes}</span>
                                </div>
                            </div>

                        </div>
                        <div className="small-3 large-3 medium-3 columns list-item-icons">
                            <span>
                                <i className="material-icons list-item-header-icon" onClick={this.handleDelete.bind(this, file.name)}>clear</i>
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        );

    }

}
