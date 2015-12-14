/**
 * Created by Praveen on 14/12/2015.
 */

import React, { PropTypes, Component } from 'react';

import * as actionCreators from '../actions/actionCreators';

export default class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'Devices'
        }
    }

    handleNavItemClick(name) {
        let {dispatch} = this.props;
        dispatch(actionCreators.selectNavigationItem(name));
        this.setState({activeItem: name});
    }

    render() {
        let {dispatch, navigation} = this.props;
        let activeClass = 'active';

        return(
            <nav className="top-bar" data-topbar role="navigation">
                <ul className="title-area">
                    <li className="name">
                        <h1>
                            <a href="#">
                                <img src="img/swoosh.png" alt="" />
                                    Axsys
                            </a>
                        </h1>
                    </li>
                    <li className="toggle-topbar menu-icon"><a href="#"><span></span></a></li>
                </ul>

                <section className="top-bar-section">
                    <ul className="left">
                        <li className={this.state.activeItem === 'Devices' ? activeClass : ''}><a href="#" onClick={this.handleNavItemClick.bind(this, 'Devices')}>Devices</a></li>
                        <li className={this.state.activeItem === 'Files' ? activeClass : ''}><a href="#" onClick={this.handleNavItemClick.bind(this, 'Files')}>Files</a></li>
                        <li className={this.state.activeItem === 'Settings' ? activeClass : ''}><a href="#" onClick={this.handleNavItemClick.bind(this, 'Settings')}>Settings</a></li>
                    </ul>
                </section>
            </nav>
        );

    }

}