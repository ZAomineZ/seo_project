/* eslint-disable */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
    BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import PropTypes from 'prop-types';
import getTooltipStyles from '../../shared/helpers';

class StatsRank extends PureComponent {
    static propTypes = {
        themeName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        monthStats: PropTypes.array.isRequired,
        yearsStats: PropTypes.array.isRequired
    };

    constructor() {
        super();
        this.state = {
            yearly: false,
        };
    }

    handleChange = () => {
        this.setState(prevState => ({yearly: !prevState.yearly}));
    };

    firstUppercase (string)
    {
        return string[0].toUpperCase() + string.slice(1)
    }

    render() {
        const {themeName, name} = this.props;
        const {yearly} = this.state;

        return (
            <div>
                <div dir="ltr">
                    <ResponsiveContainer height={260}>
                        {yearly
                            ? (
                                <BarChart data={this.props.yearsStats} margin={{top: 20, left: -15}}>
                                    <XAxis dataKey="name" tickLine={false}/>
                                    <YAxis tickLine={false}/>
                                    <Tooltip {...getTooltipStyles(themeName, 'defaultItems')} />
                                    <CartesianGrid vertical={false}/>
                                    <Bar dataKey="value" name={this.firstUppercase(name)} fill="#ff4861" barSize={10}/>
                                </BarChart>
                            )
                            : (
                                <BarChart data={this.props.monthStats} margin={{top: 20, left: -15}}>
                                    <XAxis dataKey="name" tickLine={false}/>
                                    <YAxis tickLine={false}/>
                                    <Tooltip {...getTooltipStyles(themeName, 'defaultItems')} />
                                    <CartesianGrid vertical={false}/>
                                    <Bar dataKey="value" name={this.firstUppercase(name)} fill="#4ce1b6" barSize={4}/>
                                </BarChart>
                            )
                        }

                    </ResponsiveContainer>
                </div>
                <hr/>
                <label htmlFor={name} className="toggle-btn dashboard__sales-toggle">
                    <input className="toggle-btn__input" type="checkbox" name={name} id={name}
                           onChange={this.handleChange}/>
                    <span className="dashboard__sales-toggle-left">By Day</span>
                    <span className="toggle-btn__input-label"/>
                    <span className="dashboard__sales-toggle-right">By Month</span>
                </label>
            </div>
        );
    }
}

export default connect(state => ({themeName: state.theme.className}))(StatsRank);
