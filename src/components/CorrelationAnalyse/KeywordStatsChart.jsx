/* eslint-disable */
import React, {PureComponent} from "react";
import KeywordPanel from "./keywordPanel";
import PropTypes from "prop-types";

export default class KeywordStatsChart extends PureComponent
{
    constructor()
    {
        super();
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        Top3TitleCharts: PropTypes.string.isRequired,
        Top10TitleCharts: PropTypes.string.isRequired,
        Top25TitleCharts: PropTypes.string.isRequired,
        Top50TitleCharts: PropTypes.string.isRequired,
        Top100TitleCharts: PropTypes.string.isRequired
    };

    render() {
        return (
            <div className='col-md-12 col-xs-12'>
                <KeywordPanel title={this.props.title}
                              charts={true}
                              Top3TitleCharts={this.props.Top3TitleCharts}
                              Top10TitleCharts={this.props.Top10TitleCharts}
                              Top25TitleCharts={this.props.Top25TitleCharts}
                              Top50TitleCharts={this.props.Top50TitleCharts}
                              Top100TitleCharts={this.props.Top100TitleCharts} />
            </div>
        );
    }
}
