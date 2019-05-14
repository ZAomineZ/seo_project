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
import {Redirect} from "react-router-dom";

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
            error_message: ''
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

    componentDidMount() {
        axios.get('http://localhost/ReactProject/App/Ajax/linkprofile_mount.php', {
            params: {
                'domain': this.PropsChange(this.props.domain)
            },
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.data.error === '') {
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
                } else {
                    this.setState({ error : !this.state.error, error_message: response.data.error });
                }
        });
    }

    render() {
        if (this.state.error === true) {
            return (
                <Redirect to={{
                    pathname: '/linkprofile',
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
            const img_overview3 = "https://majestic.com/charts/linkprofile/3/?target=" + this.PropsChange(this.props.domain) + "&datatype=2&IndexDataSource=F";

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
                                <th>Referring subnets</th>
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
                                    <ModalOverview btn="Overview" img_1={img_overview1} img_2={img_overview2}
                                                   img_3={img_overview3}/>
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
                                    <p className="font-default-size">{this.state.referring}</p>
                                    <div className="place_flex">
                                        {this.state.color_referring === "#ff0000" ? svg_red : ''}
                                        {this.state.color_referring === "#008000" ? svg_green : ''}
                                        {this.state.color_referring === "" ? '' : ''}
                                        <p className="dashboard__total-stat">{this.state.place_reffering}</p>
                                    </div>
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