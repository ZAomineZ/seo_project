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
        Top5TitleCharts: PropTypes.string.isRequired,
        Top10TitleCharts: PropTypes.string.isRequired,
        top3Stats: PropTypes.float,
        top5Stats: PropTypes.float,
        top10Stats: PropTypes.float,
        data: PropTypes.array.isRequired
    };

    render() {
        return (
            <div className='col-md-12 col-xs-12'>
                <KeywordPanel title={this.props.title}
                              charts={true}
                              top3Stats={this.props.top3Stats}
                              top5Stats={this.props.top5Stats}
                              top10Stats={this.props.top10Stats}
                              Top3TitleCharts={this.props.Top3TitleCharts}
                              Top5TitleCharts={this.props.Top5TitleCharts}
                              Top10TitleCharts={this.props.Top10TitleCharts}
                              data={this.props.data} />
            </div>
        );
    }
}
