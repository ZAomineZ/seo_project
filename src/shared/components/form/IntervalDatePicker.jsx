/* eslint-disable */
import React, {PureComponent} from 'react';
import DatePicker from 'react-datepicker';
import MinusIcon from 'mdi-react/MinusIcon';
import PropTypes from 'prop-types';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../../shared/components/Notification";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={type === 'danger' ? '👋 Danger !!!' : '👋 Well done !!!'}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class IntervalDatePickerField extends PureComponent {
    static propTypes = {
        valueStartDate: PropTypes.string,
        valueEndDate: PropTypes.string,
        date_array: PropTypes.array,
        keyword: PropTypes.string,
        type_btn: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            redirectTo: false,
            redirectToSerp: false,
            DateRedirect: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange({startDate, endDate}) {
        startDate = startDate || this.state.startDate;
        endDate = endDate || this.state.endDate;

        if (startDate !== null && startDate.isAfter(endDate)) {
            endDate = startDate;
        }

        this.setState({startDate, endDate});
    }

    handleChangeStart = startDate => this.handleChange({startDate});

    handleChangeEnd = endDate => this.handleChange({endDate});

    ClickBtn(event, start_date, end_date, date_state) {
        event.preventDefault();
        let search_start = this.props[0].date_array.filter(d => d === start_date);
        let search_end = this.props[0].date_array.filter(d => d === end_date);
        if (search_start.length !== 0 && search_end.length !== 0) {
            this.setState({redirectTo: !this.state.redirectTo});
            this.setState({DateRedirect: date_state});
        } else {
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('The dates you have chosen are not registered in our database, we have redirected you to the last dates !!!', 'danger'), 700);
        }
    }

    RedirectSerp(event) {
        event.preventDefault();
        this.setState({redirectToSerp: !this.state.redirectToSerp})
    }

    render() {
        let moment = require('moment');

        if (this.state.redirectTo === true) {
            this.setState({redirectTo: !this.state.redirectTo});
            return (
                <Redirect to={{
                    pathname: '/seo/serp/' + this.props[0].keyword + '/' + this.state.DateRedirect,
                    state: [
                        {
                            'type': true,
                            'StartDate': this.state.startDate === null ? this.props[0].valueStartDate : this.state.startDate.format("MMM D, Y"),
                            'EndDate': this.state.endDate === null ? this.props[0].valueEndDate : this.state.endDate.format("MMM D, Y"),
                            'value': this.props[0].value
                        }
                    ]
                }}/>
            )
        } else if (this.state.redirectToSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp/' + this.props[0].keyword,
                    state: {'value': this.props[0].value}
                }}/>
            )
        }
        return (
            <div className="date-picker date-picker--interval">
                <DatePicker
                    selected={this.state.startDate}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeStart}
                    value={this.state.startDate === null ? this.props[0].valueStartDate : this.state.startDate.format('LL')}
                    dateFormat="LL"
                    disabled={!!this.props[0].type_btn}
                    placeholderText="From"
                />
                <MinusIcon className="date-picker__svg"/>
                <DatePicker
                    selected={this.state.endDate}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeEnd}
                    value={this.state.endDate === null ? this.props[0].valueEndDate : this.state.endDate.format('LL')}
                    dateFormat="LL"
                    disabled={!!this.props[0].type_btn}
                    placeholderText="To"
                />
                <div className="pl-3">
                    {
                        !this.props[0].type_btn ?
                            <button className="btn btn-sm btn-primary"
                                    onClick={(e) => this.ClickBtn(e, this.state.startDate === null ? this.props[0].valueStartDate : this.state.startDate.format('MMM D, Y'),
                                        this.state.endDate === null ? this.props[0].valueEndDate : this.state.endDate.format('MMM D, Y'),
                                        this.state.endDate === null ? moment(this.props[0].valueEndDate).format('YYYY-MM-DD') : this.state.endDate.format('YYYY-MM-DD'))}>Enjoy
                            </button> : ''
                    }
                    {
                        this.props[0].type_btn ? <button className="btn btn-sm btn-danger"
                                                         onClick={(e) => this.RedirectSerp(e)}>Reset to default
                        </button> : ''
                    }
                </div>
            </div>
        );
    }
}

const renderIntervalDatePickerField = props => (
    <IntervalDatePickerField
        {...props.input}
    />
);

renderIntervalDatePickerField.propTypes = {
    input: PropTypes.shape({
        valueStartDate: PropTypes.string,
        valueEndDate: PropTypes.string,
        date_array: PropTypes.array,
        keyword: PropTypes.string,
        type_btn: PropTypes.bool,
        value: PropTypes.string
    }).isRequired,
};

export default renderIntervalDatePickerField;
