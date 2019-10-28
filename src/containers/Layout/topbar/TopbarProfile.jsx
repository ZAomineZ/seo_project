/* eslint-disable */
import React, {PureComponent} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {Collapse} from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import PropTypes from 'prop-types';

const Ava = `${process.env.PUBLIC_URL}/img/user_logo.png`;
const Ava_F = `${process.env.PUBLIC_URL}/img/user_logoF.png`;

export default class TopbarProfile extends PureComponent {
    static propTypes = {
        username: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.state = {
            collapse: false,
        };
    }

    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    render() {
        return (
            <div className="topbar__profile">
                <button className="topbar__avatar" onClick={this.toggle}>
                    <img className="topbar__avatar-img" src={this.props.gender !== '' ?
                        this.props.gender === 'M'
                            ? Ava
                            : Ava_F
                        : Ava} alt="avatar"/>
                    <p className="topbar__avatar-name">{this.props.username}</p>
                    <DownIcon className="topbar__icon"/>
                </button>
                {this.state.collapse && <button className="topbar__back" onClick={this.toggle}/>}
                <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
                    <div className="topbar__menu">
                        <TopbarMenuLink title="Log Out" icon="exit" path="/log_out"/>
                    </div>
                </Collapse>
            </div>
        );
    }
}
