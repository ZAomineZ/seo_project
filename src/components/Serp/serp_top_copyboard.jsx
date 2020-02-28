/* eslint-disable */
import React, {PureComponent} from "react";
import CopyToClipboard from "react-clipboard.js";
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import PropTypes from "prop-types";
import {Card, CardBody, Col} from 'reactstrap';

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

export default class SerpTopCopyboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            copied: false
        }
    }

    static propTypes = {
        top_10_url: PropTypes.array.isRequired,
        top_20_url: PropTypes.array.isRequired,
        top_30_url: PropTypes.array.isRequired,
        top_50_url: PropTypes.array.isRequired,
        top_100_url: PropTypes.array.isRequired,
    };

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

        return (
            <Col xs={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">Copy to ClipBoard</h5>
                        </div>
                        <div style={{paddingLeft: '5px'}}>
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
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
