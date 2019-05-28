/* eslint-disable */
import React, {PureComponent} from 'react';
import { Card, CardBody, Progress, Table } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import ModalCrawl from '../../../../components/Crawl/modal_crawl';
import CrawlStat from '../../../../components/Crawl/crawl_stats';
import axios from "axios";
import {BasicNotification} from "../../../../shared/components/Notification";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={type === 'danger' ? '👋 A Error is present !!!' : '👋 Well done !!!'}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class ResponsiveTable extends PureComponent {
    static propTypes = {
      url_domain: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dup_title: [],
            dup_meta: [],
            dup_h1: [],
            loading: true,
            loaded: false,
            redirectCrawl: false,
        }
    }

    componentDidMount() {
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/Crawl.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'url': this.props.url_domain
            }
        }).then((response) => {
            if (response.data !== '') {
                this.setState({
                    data: response.data.data,
                    dup_title: response.data.dup_title,
                    dup_meta: response.data.dup_meta,
                    dup_h1: response.data.dup_h1,
                    loading: false
                });
                setTimeout(() => this.setState({ loaded: true }), 500);
            } else {
                setTimeout(() => showNotification('Your Request is so many long !!!', 'danger'), 700);
                this.setState({ redirectCrawl: !this.state.redirectCrawl })
            }
        })
    }

    render() {
        const data = this.state.data.map(d => {
            return {
                uri: d.uri,
                status: d.status,
                location: d.location,
                content_type: d.content_type,
                title: d.title,
                h1: d.h1,
                text: d.text,
                ratio: d.ratio,
                meta_description: d.meta_description,
                robots: d.robots,
                canonical: d.canonical,
                links_intern: d.links.map(data => data.startsWith(this.state.data[0].uri) || data.startsWith(this.state.data[0].uri + '/') ? data : null),
                links_extern: d.links.map(data => data.indexOf(this.state.data[0].uri) === -1 || data.startsWith(this.state.data[0].uri + '/') === -1 ? data : null)
            }
        });
        const data_end = data.map(d => {
            return {
                uri: d.uri,
                status: d.status,
                location: d.location,
                content_type: d.content_type,
                title: d.title,
                h1: d.h1,
                text: d.text,
                ratio: d.ratio,
                meta_description: d.meta_description,
                robots: d.robots,
                canonical: d.canonical,
                links_intern: d.links_intern.filter(function (el) { return el != null }),
                links_extern: d.links_extern.filter(function (el) { return el != null }),
            }
        });

        if (this.state.redirectCrawl) {
            return (
                <Redirect to={{
                    pathname: '/seo/crawl',
                }}/>
            );
        }

        return (
            <div>
                {!this.state.loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <CrawlStat dup_title={ this.state.dup_title }
                           dup_meta={this.state.dup_meta}
                           dup_h1={this.state.dup_h1}
                           data={data_end}/>
                <Card>
                    <CardBody>
                        <Table responsive className="table--bordered table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>URL</th>
                                <th>Status</th>
                                <th>Content</th>
                                <th>TITLE</th>
                                <th>H1</th>
                                <th>Text</th>
                                <th>Meta Description</th>
                                <th>Meta Robots</th>
                                <th>Canonical</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data_end.map((d, key)=> (
                                    <tr>
                                        <td>
                                            { key + 1 }
                                        </td>
                                        <td>
                                            { d.uri }
                                            {
                                                d.location !== d.uri ?
                                                    <p>
                                                        <span className="lnr lnr-sync cl_green"> </span>
                                                        { d.location }
                                                    </p>
                                                    : ''
                                            }
                                            <div className="row">
                                                <ModalCrawl
                                                    color="success"
                                                    title="Links Intern"
                                                    btn={ d.links_intern.length }
                                                    data={ d.links_intern.length >= 1 ? d.links_intern : []  }
                                                />
                                                <ModalCrawl
                                                    color="primary"
                                                    title="Links Extern"
                                                    btn={ d.links_extern.length }
                                                    data={ d.links_extern.length >= 1 ? d.links_extern : [] }
                                                />
                                            </div>
                                        </td>
                                        <td>{ d.status }</td>
                                        <td>{ d.content_type }</td>
                                        <td>
                                            { d.title }
                                            <div className={ d.title[0].length > 60
                                                ? "pt-5 progress-wrap progress-wrap--small progress-wrap--pink progress-wrap--label-top"
                                                : "pt-5 progress-wrap progress-wrap--small progress-wrap--label-top" }>
                                                <Progress value={(d.title[0].length / 60) * 100 }>
                                                    <p className="progress__label">{ Math.round((d.title[0].length / 60) * 100) } %</p>
                                                </Progress>
                                            </div>
                                        </td>
                                        <td>
                                            { d.h1 }
                                        </td>
                                        <td>{ d.text }</td>
                                        <td>
                                            <div className="panel__content">
                                                <p>
                                                    { d.meta_description }
                                                </p>
                                                <div className={ d.meta_description[0].length > 158
                                                    ? "pt-5 progress-wrap progress-wrap--small progress-wrap--pink progress-wrap--label-top"
                                                    : "pt-5 progress-wrap progress-wrap--small progress-wrap--label-top" }>
                                                    <Progress value={(d.meta_description[0].length / 158) * 100 }>
                                                        <p className="progress__label">{Math.round((d.meta_description[0].length / 158) * 100) } %</p>
                                                    </Progress>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            { d.robots }
                                        </td>
                                        <td>
                                            { d.canonical }
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default translate('common')(ResponsiveTable);
