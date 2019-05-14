/* eslint-disable */
import React, {PureComponent} from 'react';
import {Badge, Card, CardBody, Collapse} from 'reactstrap';
import PropTypes from 'prop-types';

import CloseIcon from 'mdi-react/CloseIcon';
import MinusIcon from 'mdi-react/MinusIcon';
import AutorenewIcon from 'mdi-react/AutorenewIcon';
import LoadingIcon from 'mdi-react/LoadingIcon';
import {Link, Redirect} from "react-router-dom";

export default class AlertComponent extends PureComponent {
    static propTypes = {
        divider: PropTypes.bool,
        color: PropTypes.string,
        title: PropTypes.string,
        subhead: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
        panelClass: PropTypes.string,
        button: PropTypes.string,
        keyword: PropTypes.string.isRequired,
        date_comparaison: PropTypes.bool.isRequired,
        state_location: PropTypes.array
    };

    static defaultProps = {
        divider: false,
        color: '',
        title: '',
        subhead: '',
        label: '',
        icon: '',
        panelClass: '',
        button: '',
    };

    constructor() {
        super();

        this.state = {
            visible: true,
            collapse: true,
            refresh: false,
        };
    }

    onShow = () => {
        this.setState({visible: true});
    };

    onDismiss = () => {
        this.setState({visible: false});
    };

    onCollapse = () => {
        this.setState({collapse: !this.state.collapse});
    };

    onRefresh = () => {
        // your async logic here
        this.setState({refresh: !this.state.refresh});
        setTimeout(() => this.setState({refresh: false}), 5000);
    };

    render() {
        const {
            color, divider, icon, title, label, subhead, panelClass, button,
        } = this.props;

        let moment = require('moment');

        if (this.state.visible) {
            return (
                <Card
                    className={`panel${this.props.color ? ` panel--${color}` : ''}
            ${divider ? ' panel--divider' : ''}${this.state.collapse ? '' : ' panel--collapse'} ${panelClass}`}
                >
                    <CardBody className="panel__body">
                        {this.state.refresh ? <div className="panel__refresh"><LoadingIcon/></div> : ''}
                        <div className="panel__btns">
                            <button className="panel__btn" onClick={this.onCollapse}><MinusIcon/></button>
                            <button className="panel__btn" onClick={this.onRefresh}><AutorenewIcon/></button>
                            <button className="panel__btn" onClick={this.onDismiss}><CloseIcon/></button>
                        </div>
                        <div className="panel__title">
                            <h5 className="bold-text">
                                {icon ? <span className={`panel__icon lnr lnr-${icon}`}/> : ''}
                                {title}
                                <Badge className="panel__label">{label}</Badge>
                                {this.props.button ?
                                    this.props.date_comparaison === true ?
                                        <Link className="btn_style btn-outline-primary"
                                            to={{
                                            pathname: '/serp_comparison/' + this.props.keyword + '/' + moment(this.props.state_location[0].EndDate).format('YYYY-MM-DD'),
                                            state: [
                                                {
                                                    'StartDate': this.props.state_location[0].StartDate,
                                                    'EndDate': this.props.state_location[0].EndDate
                                                }
                                            ]
                                        }}>{button}</Link> :
                                        <a href={'/seo/serp_comparison/' + this.props.keyword}
                                           className="btn_style btn-outline-primary">
                                            {button}
                                        </a>
                                    : ''}
                            </h5>
                            <h5 className="subhead">{subhead}</h5>
                        </div>
                        <Collapse isOpen={this.state.collapse}>
                            <div>
                                {this.props.children}
                            </div>
                        </Collapse>
                    </CardBody>
                </Card>
            );
        }

        return '';
    }
}

export const PanelTitle = ({title}) => (
    <div className="panel__title">
        <h5 className="bold-text">
            {title}
        </h5>
    </div>
);
