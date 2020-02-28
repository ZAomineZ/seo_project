/* eslint-disable */
import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Polar} from "react-chartjs-2";

export default class BarChartTab extends PureComponent
{
    constructor(props)
    {
        super(props);
        this.state = {
            dataChart: []
        }
    }

    static propTypes = {
      data: PropTypes.array.isRequired
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.data && nextProps.data.length !== 0) {
            const data = {
                datasets: [{
                    data: [nextProps.data.map(d => d.percentage)][0],
                    backgroundColor: [nextProps.data.map(d => d.fill)][0],
                    label: 'My dataset',
                    borderColor: 'rgba(255,255,255,0.54)',
                }],
                labels: [nextProps.data.map(d => d.name)][0],
            };

            this.setState({dataChart: data})
        }
    }

    render() {
        const {dataChart} = this.state;

        const options = {
            legend: {
                position: 'bottom',
            },
            scale: {
                gridLines: {
                    color: 'rgb(204, 204, 204)',
                    borderDash: [3, 3],
                },
                ticks: {
                    fontColor: 'rgb(204, 204, 204)',
                },
            },
        };


        return (
            <div id='charts-tab'>
                {
                    dataChart.length !== 0 && <Polar data={dataChart} options={options} />
                }
            </div>
        );
    }
}
