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
import {route, requestUri} from '../../const'
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import {Redirect} from "react-router-dom";
import SerpTopCopyboard from "./serp_top_copyboard";
import SerpVolumeCharts from "./serp_volume_charts";

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

    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
    }

    constructor() {
        super();
        console.error = () => {
        };
        console.error();
        this.state = {
            description: [],
            url: [],
            date: [],
            date_format: [],
            dataVl: [],
            rank: [],
            trends: [],
            serpFeature: [],
            volume: 0,

            loading: true,
            loaded: false,
            loadedTrend: false,
            volumeFind: false,

            error: false,
            redirectSerp: false
        }
    }

    onDeleteCryptoTableData = (index, e) => {
        e.preventDefault();
        const arrayCopy = [...this.props.cryptoTable];
        arrayCopy.splice(index, 1);
        this.props.dispatch(deleteCryptoTableData(arrayCopy));
    };

    SetCookie(name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
    }

    CookieReset(token, id) {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.value === undefined && this.props.location.state[0].error) {
            this.setState({redirectSerp: !this.state.redirectSerp});
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification(this.props.location.state[0].error, 'danger'), 700);
        } else if (this.props.location.state === undefined) {
            this.setState({redirectSerp: !this.state.redirectSerp})
        } else {
            this.volumeSerpResult();
        }
    }

    serpKeyword()
    {
        axios.get(requestUri + window.location.hostname + route + '/Ajax/Serp.php', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                'Access-Control-Max-Age': 1728000,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
            },
            params: {
                keyword: this.props.match.params.keyword,
                value: this.props.location.state !== undefined ? this.props.location.state.value : '',
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
            }
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    } else if (response.data.error && response.data.error === 'Invalid Value') {
                        this.setState({redirectSerp: !this.state.redirectSerp});

                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                    } else if (response.data.error && response.data.error === 'Limit exceeded !!!') {
                        this.setState({redirectSerp: !this.state.redirectSerp});

                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                    } else if (response.data.error && response.data.error === 'Any Result found !!!') {
                        this.setState({redirectSerp: !this.state.redirectSerp});

                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                    }
                } else {
                    this.setState({
                        url: response.data.url,
                        description: response.data.description,
                        rank: response.data.rank,
                        serpFeature: response.data.serpFeature ? Object.values(response.data.serpFeature) : [],
                        date: response.data.date,
                        date_format: response.data.date_format,
                        dataVl: response.data.dataVolume ? response.data.dataVolume.volume : [],
                        loading: false
                    });
                    setTimeout(() => this.setState({loaded: true}), 500);
                    if (this.state.description && this.state.description.length === 0) {
                        this.setState({error: !this.state.error});
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('A error has been detected, this error will be fixed as soon as possible', 'danger'), 700);
                    }
                }
            }
        });
    }

    rankEmpty() {
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        let rankEntries = Object.entries(this.state.rank);

        const params = {
            keyword: this.props.match.params.keyword,
            value: this.props.location.state !== undefined ? this.props.location.state.value : '',
            rank: rankEntries.filter(d => d[1].length === 0),
            cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + '/Ajax/SerpEmptyRank.php', {
            headers: headers,
            params: params
        }).then(response => {
            if (response.status && response.status === 200 && response.data.dataRank) {
                const dataRank = response.data.dataRank;
                const dateArray = response.data.dates;
                const formatDatesArray = response.data.formatDates;

                this.setState({
                    rank: dataRank,
                    date: dateArray,
                    date_format: formatDatesArray
                });
            }
        })
    }

    volumeSerpResult()
    {
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            keyword: this.props.match.params.keyword,
            value: this.props.location.state !== undefined ? this.props.location.state.value : '',
            cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + '/Ajax/SerpVolumeResult.php', {
            headers: headers,
            params: params
        }).then(response => {
            if (response.status && response.status === 200 && response.data.data) {
                this.setState({
                    trends: response.data.data.trends ? Object.values(response.data.data.trends) : [],
                    volume: response.data.data.volume,
                    loadedTrend: true,
                    volumeFind: !this.state.volumeFind
                });

                if (this.state.volumeFind) {
                    setTimeout(() => this.serpKeyword(), 2000);
                    setTimeout(() => this.rankEmpty(), 2000);
                }
            }
        })
    }

    render() {
        const {t} = this.props;

        if (this.state.error === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        if (this.state.redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        const url_data = this.props.location.state !== undefined ? this.state.url.filter(d => d !== null) : '';

        if (this.props.location.state !== undefined) {
            return (
                <Container className="dashboard">
                    <Row>
                        <Col md={12}>
                            <h3 className="page-title">{t('Serp Dashboard')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <DatePickers date_array={this.state.date_format}
                                     dt_array={[]}
                                     type_btn={false}
                                     keyword={this.props.match.params.keyword}
                                     value={typeof (this.props.location.state) == 'undefined' ? '' : this.props.location.state.value}/>
                        <SerpVolumeCharts trends={this.state.trends}
                                          volume={this.state.volume}
                                          loaded={this.state.loadedTrend} />
                    </Row>
                    <Row>
                        <SerpTopCopyboard top_10_url={url_data.slice(0, 10)}
                                          top_20_url={url_data.slice(0, 20)}
                                          top_30_url={url_data.slice(0, 30)}
                                          top_50_url={url_data.slice(0, 50)}
                                          top_100_url={url_data.slice(0, url_data.length)} />
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
                                <svg className="mdi-icon " width="24" height="24" fill="currentColor"
                                     viewBox="0 0 24 24">
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
                                array_serpFeature={this.state.serpFeature}
                                dataVl={this.state.dataVl}
                                keyword={this.props.match.params.keyword}
                                date_comparaison={false}
                                value={typeof (this.props.location.state) == 'undefined' ? '' : this.props.location.state.value}
                            />
                        </div>
                    </Row>
                </Container>
            );
        } else {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
    }
}

export default connect(state => ({
    cryptoTable: state.cryptoTable.items,
}))(translate('common')(CryptoDashboard));



