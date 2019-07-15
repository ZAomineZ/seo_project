/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import {Field, reduxForm} from 'redux-form';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import IntervalDatePickerField from '../../../../shared/components/form/IntervalDatePicker';
import CopyToClipboard from 'react-clipboard.js';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../../../shared/components/Notification";

let notification = null;

const showNotification = (message) => {
    notification.notice({
        content: <BasicNotification
            color="success"
            title="👋 Well done !!!"
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class DatePickers extends PureComponent {
    static propTypes = {
        handleSubmit: PropTypes.func,
        top_10_url: PropTypes.array.isRequired,
        top_20_url: PropTypes.array.isRequired,
        top_30_url: PropTypes.array.isRequired,
        top_50_url: PropTypes.array.isRequired,
        top_100_url: PropTypes.array.isRequired,
        date_array: PropTypes.array.isRequired,
        dt_array: PropTypes.array.isRequired,
        type_btn: PropTypes.bool.isRequired,
        keyword: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            copied: false
        }
    }

    ClickCopy(event, number_url) {
        event.preventDefault();
        this.setState({copied: true});
        if (!this.state.copied) {
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You are copied the top ' + number_url + ' url !!!'), 700);
            this.setState({copied: false});
        } else {
            if (notification) {
                notification.destroy();
            }
        }
    }

    render() {
        // Create Url for btn Top_100_Url !!!
        let str_data_100 = '';
        this.props.top_100_url.map(d => {
            str_data_100 += d + '\n'
        });

        // Create Url for btn Top_50_Url !!!
        let str_data_50 = '';
        this.props.top_50_url.map(d => {
            str_data_50 += d + '\n'
        });

        // Create Url for btn Top_30_Url !!!
        let str_data_30 = '';
        this.props.top_30_url.map(d => {
            str_data_30 += d + '\n'
        });

        // Create Url for btn Top_20_Url !!!
        let str_data_20 = '';
        this.props.top_20_url.map(d => {
            str_data_20 += d + '\n'
        });

        // Create Url for btn Top_10_Url !!!
        let str_data_10 = '';
        this.props.top_10_url.map(d => {
            str_data_10 += d + '\n'
        });

        let moment = require('moment');

        return (
            <Col xs={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs={12} md={12} lg={12} xl={6}>
                                <div className="card__title">
                                    <h5 className="bold-text">Date Picker</h5>
                                </div>
                                <form className="form"
                                      onSubmit={this.props.handleSubmit ? this.props.handleSubmit : ''}>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Interval Date Picker</span>
                                        <div className="form__form-group-field">
                                            <Field
                                                name="date_time"
                                                component={() => <IntervalDatePickerField input={[
                                                    {
                                                        'valueStartDate': this.props.dt_array.length === 0 ?
                                                            this.props.date_array[this.props.date_array.length - 2]
                                                            : moment(this.props.dt_array[0]).format('LL'),
                                                        'valueEndDate':  this.props.dt_array.length === 0 ?
                                                            this.props.date_array[this.props.date_array.length - 1]
                                                            : moment(this.props.dt_array[1]).format('LL'),
                                                        'date_array': this.props.date_array,
                                                        'keyword': this.props.keyword,
                                                        'type_btn': this.props.type_btn,
                                                        'value': this.props.value
                                                    }
                                                    ]}
                                                />
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            <Col xs={12} md={12} lg={12} xl={6}>
                                <div className="card__title">
                                    <h5 className="bold-text">Copy to ClipBoard</h5>
                                </div>
                                <div>
                                    <span className="form__form-group-label">By Url</span>
                                </div>
                                <div>
                                    <CopyToClipboard data-clipboard-text={str_data_100}
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={(e) => this.ClickCopy(e, 100)}>
                                        Top 100
                                    </CopyToClipboard>
                                    <CopyToClipboard data-clipboard-text={str_data_50}
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={(e) => this.ClickCopy(e, 50)}>
                                        Top 50
                                    </CopyToClipboard>
                                    <CopyToClipboard data-clipboard-text={str_data_30}
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={(e) => this.ClickCopy(e, 30)}>
                                        Top 30
                                    </CopyToClipboard>
                                    <CopyToClipboard data-clipboard-text={str_data_20}
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={(e) => this.ClickCopy(e, 20)}>
                                        Top 20
                                    </CopyToClipboard>
                                    <CopyToClipboard data-clipboard-text={str_data_10}
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={(e) => this.ClickCopy(e, 10)}>
                                        Top 10
                                    </CopyToClipboard>
                                </div>
                                <div/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        )
    }

}

export default reduxForm({
    form: 'date_picker_form', // a unique identifier for this form
})(translate('common')(DatePickers));
