/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody, Table} from 'reactstrap';
import {translate} from 'react-i18next';
import ModalOverview from './modal_overview';
import ModalProfile from './modal_profile';
import ModalBacklinks from './modal_backlinks';
import ModalInfoBackLinks from './modal_info_backlinks';
import ModalReferring from './modal_referring';
import ModalReferringInfo from './modal_referring-info';
import PropTypes from "prop-types";
import axios from "axios";
import {route} from '../../const'
import {Redirect} from "react-router-dom";
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";

let notification = null;

const showNotification = (title, message, color) => {
    notification.notice({
        content: <BasicNotification
            color={color}
            title={title}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class tab_linkprofile extends PureComponent {
    static propTypes = {
        domain: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loaded: false,
            ip_referring: '',
            referring: '',
            authority: '',
            authority_diff: '',
            backlink_total: 0,
            referring_total: 0,
            follow: 0,
            nofollow: 0,
            text: 0,
            image: 0,
            bl_data: [],
            page_data: [],
            referring_data: [],
            anchor_data: [],
            anchor_label: [],
            place_reffering: '',
            place_ip_referring: '',
            color_referring: '',
            color_ip_referring: '',
            power: [],
            power_last: '',
            date: [],
            date_diff: 0,
            error: false,
            error_message: '',
            redirectSerp: false
        }
    }

    PropsChange(string) {
        let str_last =  string.lastIndexOf('-');
        let replace_str = string.slice(0, str_last);
        let replace_str2 = string.slice(str_last, string.length);
        let string_end = replace_str2.replace('-', '.');
        return replace_str + string_end
    }

    DiffAutority ()
    {
        let diff = (this.state.authority - this.state.authority_diff);
        if (Math.sign(diff) === -1) {
            return Math.abs(diff)
        }
        return diff
    }

    SetCookie (name_cookie, value_cookie, expire_days)
    {
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

    CookieReset (token, id)
    {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({ redirectSerp : !this.state.redirectSerp})
    }

    componentDidMount() {
        axios.get('http://' + window.location.hostname + route + '/Ajax/linkprofile_mount.php', {
            params: {
                domain: this.PropsChange(this.props.domain),
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
            },
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
        }).then((response) => {
                    if (response.data.error && response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id);
                    } else if (response.data.error && response.data.error === 'Invalid Value') {
                        this.setState({ redirectSerp : !this.state.redirectSerp});
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('Error Message', response.data.error, 'danger'), 700);
                    } else {
                        if (response.data.error && response.data.error !== 'Invalid Value' && response.data.error !== 'Invalid Token') {
                            this.setState({ error : !this.state.error, error_message: response.data.error });
                        } else {
                            if (response.data && response.data === 'Invalid Token !!!') {
                                this.setState({ redirectSerp : !this.state.redirectSerp});
                            }
                            this.setState({
                                ip_referring: response.data.ip_referring,
                                referring: response.data.referring,
                                authority: response.data.authority,
                                authority_diff: response.data.authority_diff,
                                backlink_total: response.data.backlink_total,
                                referring_total: response.data.referring_total,
                                follow: response.data.follow,
                                nofollow: response.data.nofollow,
                                text: response.data.text,
                                image: response.data.image,
                                bl_data: response.data.bl_data,
                                page_data: response.data.page_data,
                                referring_data: response.data.referring_data,
                                anchor_data: response.data.anchor_data,
                                anchor_label: response.data.anchor_label,
                                place_reffering: response.data.place_reffering,
                                place_ip_referring: response.data.place_ip_referring,
                                color_referring: response.data.color_referring,
                                color_ip_referring: response.data.color_ip_referring,
                                power: response.data.power,
                                power_last: response.data.power_last,
                                date: response.data.date,
                                date_diff: response.data.date_diff,
                                loading: false
                            });
                            setTimeout(() => this.setState({ loaded: true }), 500);
                        }
                    }
        });
    }

    render() {
        if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        if (this.state.error === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/linkprofile',
                    state: { error: this.state.error_message }
                }} />
            );
        } else {
            const { loaded, power, power_last, bl_data, page_data, anchor_data, anchor_label, referring_data, date_diff } = this.state;

            const Math_sign = Math.sign(this.state.authority - this.state.authority_diff);

            const img_icon = "https://s2.googleusercontent.com/s2/favicons?domain=" + this.PropsChange(this.props.domain);
            const img_magestic = "https://fr.majestic.com/charts/linkprofile/2/?target=" + this.PropsChange(this.props.domain) + "&IndexDataSource=F";

            const img_overview1 = "https://majestic.com/charts/linkprofile/3/?target=" + this.PropsChange(this.props.domain) + "&datatype=0&IndexDataSource=F";
            const img_overview2 = "https://majestic.com/charts/linkprofile/3/?target=" + this.PropsChange(this.props.domain) + "&datatype=1&IndexDataSource=F";

            const img_backlink = "https://majestic.com/charts/backlinks-discovery-chart?w=850&h=600&IndexDataSource=F&d=" + this.PropsChange(this.props.domain);
            const img_referring = "http://majestic.com/charts/referring-domains-discovery-chart?w=850&h=600& IndexDataSource=F&d=" + this.PropsChange(this.props.domain);

            const svg_red = <svg className="mdi-icon dashboard_top_serp_icon"
                                 width="24"
                                 height="24"
                                 fill="currentColor"
                                 viewBox="0 0 24 24">
                <path
                    d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,
                            7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z" />
            </svg>;
            const svg_green = <svg className="mdi-icon dashboard__trend-icon"
                                   width="24"
                                   height="24"
                                   fill="currentColor"
                                   viewBox="0 0 24 24">
                <path
                    d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,
                                18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
            </svg>;

            let numbro = require('numbro');

            return (
                <Card>
                    <CardBody>
                        {!loaded &&
                        <div className="panel__refresh">
                            <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                            </svg>
                        </div>
                        }
                        <Table responsive className="table--bordered table">
                            <thead>
                            <tr>
                                <th>*</th>
                                <th>Power</th>
                                <th>Profile Link</th>
                                <th>BackLinks</th>
                                <th>Referring domains</th>
                                <th>URL</th>
                                <th>Authority</th>
                                <th>BL Follow</th>
                                <th>Referring IPs</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <img className="img-icon" src={img_icon} alt=""/>
                                </td>
                                <td>
                                    <ModalProfile date={this.state.date} data_power={power} btn={power_last}/>
                                    <div className="place_flex">
                                        { Math.sign(date_diff) === -1 ? svg_red : Math.sign(date_diff) === 0 ? '' : svg_green }
                                        <p className="dashboard__total-stat">{ Math.sign(date_diff) === 0 ? '' : Math.abs(date_diff) }</p>
                                    </div>
                                </td>
                                <td>
                                    <ModalOverview btn="Overview" img_1={img_overview1} img_2={img_overview2} />
                                    <img src={img_magestic} alt=""/>
                                </td>
                                <td>
                                    <ModalBacklinks btn="Backlinks" img_backlink={img_backlink}/>
                                    <ModalInfoBackLinks follow={this.state.follow}
                                                        image={this.state.image}
                                                        text={this.state.text}
                                                        nofollow={this.state.nofollow}
                                                        data_page={page_data}
                                                        data={bl_data}
                                                        anchor_data={anchor_data}
                                                        anchor_label={anchor_label}
                                                        btn={ this.state.backlink_total }/>
                                </td>
                                <td>
                                    <ModalReferring btn="Referring" img_referring={img_referring}/>
                                    <ModalReferringInfo btn={ this.state.referring_total }  referring_data={referring_data} />
                                </td>
                                <td>
                                    {this.PropsChange(this.props.domain)}
                                </td>
                                <td>
                                    <p className="font-default-size">{ this.state.authority }</p>
                                    <div className="place_flex">
                                        { Math_sign === -1 ? svg_red : Math_sign === 0 ? '' : svg_green }
                                        <p className="dashboard__total-stat">{ Math_sign === 0 ? '' : this.DiffAutority() }</p>
                                    </div>
                                </td>
                                <td>
                                    <p className="font-default-size">{ numbro(this.state.follow).format({average: true, mantissa: 2}) }</p>
                                </td>
                                <td>
                                    <p className="font-default-size">{this.state.ip_referring}</p>
                                    <div className="place_flex">
                                        {this.state.color_ip_referring === "#ff0000" ? svg_red : ''}
                                        {this.state.color_ip_referring === "#008000" ? svg_green : ''}
                                        {this.state.color_ip_referring === "" ? '' : ''}
                                        <p className="dashboard__total-stat">{this.state.place_ip_referring}</p>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            );
        }
    }
}

export default translate('common')(tab_linkprofile);
