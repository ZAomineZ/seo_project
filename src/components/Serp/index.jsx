/* eslint-disable */
import React, {PureComponent} from 'react';
import {Col, Container, Row} from 'reactstrap';
import connect from 'react-redux/es/connect/connect';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {CryptoTableProps} from '../../shared/prop-types/TablesProps';
import {deleteCryptoTableData} from '../../redux/actions/cryptoTableActions';
import TopTen from '../../containers/Dashboards/Crypto/components/TopTen';
import DatePickers from '../../containers/Form/FormPicker/components/DatePickers';
import SimpleLineChart from '../../containers/Charts/Recharts/components/SimpleLineChart';
import axios from "axios";
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
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

class CryptoDashboard extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        cryptoTable: CryptoTableProps.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        console.error = () => {};
        console.error();
        this.state = {
            description: [],
            url: [],
            date: [],
            date_format: [],
            rank: [],
            loading: true,
            loaded: false,
            error: false
        }
    }

    onDeleteCryptoTableData = (index, e) => {
        e.preventDefault();
        const arrayCopy = [...this.props.cryptoTable];
        arrayCopy.splice(index, 1);
        this.props.dispatch(deleteCryptoTableData(arrayCopy));
    };

    componentDidMount() {
        if (this.props.location.state && this.props.location.state[0].error) {
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification(this.props.location.state[0].error, 'danger'), 700);
        }
        let route = '/ReactProject/App'
        axios.get('http://' + window.location.hostname + route + '/Ajax/Serp.php', {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                keyword: this.props.match.params.keyword,
            }
        }).then((response) => {
            if (response && response.status === 200) {
                this.setState({
                    url: response.data.url,
                    description: response.data.description,
                    rank: response.data.rank,
                    date: response.data.date,
                    date_format: response.data.date_format,
                    loading: false
                });
                setTimeout(() => this.setState({loaded: true}), 500);
                if (this.state.description && this.state.description.length === 0) {
                    this.setState({ error: !this.state.error });
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification('A error has been detected, this error will be fixed as soon as possible', 'danger'), 700);
                }
            }
        });
    }

    render() {
        const {t} = this.props;

        const url_data = this.state.url.filter(d => d !== null);

        if (this.state.error === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }

        return (
            <Container className="dashboard">
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">{t('Serp Dashboard')}</h3>
                    </Col>
                </Row>
                <Row>
                    <DatePickers top_10_url={url_data.slice(0, 10)}
                                 top_20_url={url_data.slice(0, 20)}
                                 top_30_url={url_data.slice(0, 30)}
                                 top_50_url={url_data.slice(0, 50)}
                                 top_100_url={url_data.slice(0, url_data.length)}
                                 date_array={this.state.date_format}
                                 dt_array={[]}
                                 type_btn={false}
                                 keyword={this.props.match.params.keyword}/>
                </Row>
                <Row>
                    {!this.state.loaded &&
                    <div className="panel__refresh">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                        </svg>
                    </div>
                    }
                    <SimpleLineChart data_url={url_data} date_array={this.state.date}
                                     rank_object={this.state.rank}/>
                </Row>
                <Row>
                    <div className="col-xs-12 col-md-12 col-lg-12 col-xl-12">
                        {!this.state.loaded &&
                        <div className="panel__refresh">
                            <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                            </svg>
                        </div>
                        }
                        <TopTen
                            TopOrLose
                            title="Dashboard Serp"
                            buttonExist="Top/Lose"
                            cryptoTable={this.props.cryptoTable}
                            onDeleteCryptoTableData={this.onDeleteCryptoTableData}
                            array_description={this.state.description}
                            array_url={url_data}
                            array_date={this.state.date}
                            array_rank={this.state.rank}
                            keyword={this.props.match.params.keyword}
                            date_comparaison={false}
                        />
                    </div>
                </Row>
            </Container>
        );
    }
}

export default connect(state => ({
    cryptoTable: state.cryptoTable.items,
}))(translate('common')(CryptoDashboard));



