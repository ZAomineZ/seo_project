/* eslint-disable */
import React, {PureComponent} from 'react';
import KeywordPanel from "../../keywordPanel";
import PropTypes from "prop-types";

export default class TopResultByWebsite extends PureComponent
{
    constructor(props)
    {
        super(props)
    }

    static propTypes = {
        dataTop3: PropTypes.object.isRequired,
        dataTop5: PropTypes.object.isRequired,
        dataTop10: PropTypes.object.isRequired
    };

    render() {
        const {dataTop3, dataTop5, dataTop10} = this.props;

        return (
            <div id="topResult" className='row'>
                <div className="col-md-4 col-xs-4">
                    <KeywordPanel title={'Top 3 Correlation'}
                                  ipStats={dataTop3.ipStatsTop}
                                  rankScoreStats={dataTop3.rankScoreStatsTop}
                                  trustScoreStats={dataTop3.trustScoreStatsTop}
                                  ratioStats={dataTop3.ratioStatsTop}
                                  trafficStats={dataTop3.trafficStatsTop}
                                  anchorsStats={dataTop3.blInfoTop}
                                  httpsStats={dataTop3.httpsStatsTop}
                                  titleStats={dataTop3.titleStatsTop}
                                  charts={false} />
                </div>
                <div className="col-md-4 col-xs-4">
                    <KeywordPanel title={'Top 5 Correlation'}
                                  ipStats={dataTop5.ipStatsTop}
                                  rankScoreStats={dataTop5.rankScoreStatsTop}
                                  trustScoreStats={dataTop5.trustScoreStatsTop}
                                  ratioStats={dataTop5.ratioStatsTop}
                                  trafficStats={dataTop5.trafficStatsTop}
                                  anchorsStats={dataTop5.blInfoTop}
                                  httpsStats={dataTop5.httpsStatsTop}
                                  titleStats={dataTop5.titleStatsTop}
                                  charts={false} />
                </div>
                <div className="col-md-4 col-xs-4">
                    <KeywordPanel title={'Top 10 Correlation'}
                                  ipStats={dataTop10.ipStatsTop}
                                  rankScoreStats={dataTop10.rankScoreStatsTop}
                                  trustScoreStats={dataTop10.trustScoreStatsTop}
                                  ratioStats={dataTop10.ratioStatsTop}
                                  trafficStats={dataTop10.trafficStatsTop}
                                  anchorsStats={dataTop10.blInfoTop}
                                  httpsStats={dataTop10.httpsStatsTop}
                                  titleStats={dataTop10.titleStatsTop}
                                  charts={false} />
                </div>
            </div>
        )
    }
}
