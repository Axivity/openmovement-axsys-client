/**
 * Created by Praveen on 16/12/2015.
 */

import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';

import * as actionCreators from '../actions/actionCreators';


const tooltipStyles = {
    height: 20,
    width: 100,
    textAlign: 'center'
};

export default class FilesIconBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAll: false
        }
    }

    handleSelectAll(event) {
        let {files, dispatch} = this.props;
        if(!this.state.selectedAll) {
            files.map(file => dispatch(actionCreators.selectFile({
                name: file.name
            })));

        } else {
            files.map(file => dispatch(actionCreators.deSelectFile({
                name: file.name
            })));
        }

        this.setState({
            selectedAll: !this.state.selectedAll
        });
    }

    static areAllFilesSelected(selectedFiles, files) {
        return (files.length > 0 && files.length === selectedFiles.length);
    }

    render() {
        let {files, selectedFiles} = this.props;

        let checkBoxIconName = this.constructor.areAllFilesSelected(selectedFiles, files) ? 'check_box' : 'check_box_outline_blank';

        return(
            <div className="row">
                <div className="large-12 small-12 medium-12 columns ax-icon-bar-adjust-height">
                    <div className="icon-bar three-up">
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
                            overlay={<div style={tooltipStyles}><strong>Export</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>
                            <a className="item"
                               role="button">
                                <i className="material-icons">launch</i>
                            </a>
                        </Tooltip>

                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0}
                            mouseLeaveDelay={0.1}
                            overlay={<div style={tooltipStyles}><strong>Analysis</strong></div>}
                            transitionName={'rc-tooltip-zoom'}>
                            <a className="item"
                               role="button">
                                <i className="material-icons">equalizer</i>
                            </a>
                        </Tooltip>
                    </div>
                </div>
            </div>

        );
    }

}