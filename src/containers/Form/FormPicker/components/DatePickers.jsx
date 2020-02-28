/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import {Field, reduxForm} from 'redux-form';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import IntervalDatePickerField from '../../../../shared/components/form/IntervalDatePicker';
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
        date_array: PropTypes.array.isRequired,
        dt_array: PropTypes.array.isRequired,
        type_btn: PropTypes.bool.isRequired,
        keyword: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        let moment = require('moment');

        return (
            <Col xs={12} md={12} lg={12} xl={9}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs={12} md={12} lg={12} xl={12}>
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
                                                            : moment(this.props.dt_array[0]).format('MMM D, Y'),
                                                        'valueEndDate':  this.props.dt_array.length === 0 ?
                                                            this.props.date_array[this.props.date_array.length - 1]
                                                            : moment(this.props.dt_array[1]).format('MMM D, Y'),
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
