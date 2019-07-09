/* eslint-disable */
import React, {PureComponent} from 'react';
import CrawlTab from '../Crawl/crawl_tab';
import {Redirect} from "react-router-dom";

class Crawl extends PureComponent {
    constructor () {
        super();
        console.error = () => {};
        console.error();
    }
    render() {
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="page-title">Crawl</h3>
                    </div>
                </div>
                <div className="row">
                    {
                        this.props.location.state !== undefined
                            ? <CrawlTab url_domain={this.props.location.state.valueIndex}
                                        domain={this.props.match.params.domain} />
                            : <Redirect to={{
                                pathname: '/crawl',
                                state: {error: 'Url Not Valide !!!'}
                            }}/>
                    }
                </div>
            </div>
        )
    }
}

export default Crawl;
