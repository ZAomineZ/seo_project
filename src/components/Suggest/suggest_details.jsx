/* eslint-disable */
import React, {PureComponent} from 'react';
import SuggestCurrent from './suggest_current';
import SuggestQuestion from './suggest_questions';
import SuggestPreposition from './suggest_preposition';
import SuggestComparison from './suggest_comparison';
import SuggestAlpha from './suggest_alpha';
import axios from "axios";
import {route, requestUri} from '../../const'
import {Redirect} from "react-router-dom";
import Cookie from "../../js/Cookie";
import NotificationMessage from "../../js/NotificationMessage";

class SuggestDetails extends PureComponent{
    constructor ()
    {
        super();
        console.error = () => {};
        console.error();
        this.state = {
            data_current: [],
            data_questions: [],
            data_preposition: [],
            data_comparisons: [],
            data_alpha: [],

            loading: true,
            loaded: false,
            loadedBtn: true,
            redirectSerp: false
        };
        this.download = this.download.bind(this)
    }

    CookieReset (token, id)
    {
        Cookie.CookieReset(token, id);
        this.setState({ redirectSerp : !this.state.redirectSerp})
    }

    componentDidMount() {
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        };

        const params = {
            keyword: this.props.match.params.keyword,
            value: this.props.location.state !== undefined ? this.props.location.state.value : '',
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/Suggest.php", {
            headers: headers,
            params: params
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    } else if (response.data.error && response.data.error === 'Invalid Value') {
                        this.setState({ redirectSerp : !this.state.redirectSerp});
                        NotificationMessage.notification(response.data.error, 'Error Message !!!', 'danger');
                    }
                } else {
                    this.setState({
                        data_current: response.data.current,
                        data_questions: response.data.questions,
                        data_preposition: response.data.prepositions,
                        data_comparisons: response.data.comparisons,
                        data_alpha: response.data.alpha,
                        loading: false
                    });
                    setTimeout(() => this.setState({ loaded: true }), 500);
                }
            }
        })
    }

    download (event)
    {
        event.preventDefault();
        this.setState({loadedBtn: false});

        const {data_current, data_questions, data_preposition, data_comparisons, data_alpha} = this.state;
        let data = [];
        data.push(data_current, data_questions, data_preposition, data_comparisons, data_alpha);

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        };

        const params = {
            keyword: this.props.match.params.keyword,
            value: this.props.location.state !== undefined ? this.props.location.state.value : '',
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/SuggestCSV.php", {
            headers: headers,
            params: params
        }).then(response =>  {
            if (response && response.status === 200) {
                if (response.data.error) {
                    // CODE Error
                    NotificationMessage.notification(response.data.error, 'Error Message !!!', 'danger')
                }
                setTimeout(() => this.setState({ loadedBtn: true }), 750);
                window.location.href = response.request.responseURL;
            }
        })
    }

    render() {
        const {redirectSerp, loadedBtn} = this.state;

        if (redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        if (this.props.location.state !== undefined) {
            return (
                <div className="dashboard container">
                    {!this.state.loaded &&
                    <div className="panel__refresh">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                        </svg>
                    </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="page-title">Suggest</h3>
                        </div>
                        <div className="col-md-12">
                            <button className='btn btn-primary' onClick={this.download}>
                                {!loadedBtn &&
                                <div className='panel__refresh panel-refresh-custom'>
                                    <svg className="mdi-icon icon-right" width="24" height="24" fill="currentColor"
                                         viewBox="0 0 24 24">
                                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                                    </svg>
                                </div>
                                }
                                Download CSV
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <SuggestCurrent data={this.state.data_current}/>
                        <SuggestQuestion data={this.state.data_questions}/>
                        <SuggestPreposition data={this.state.data_preposition}/>
                        <SuggestComparison data={this.state.data_comparisons}/>
                    </div>
                    <SuggestAlpha data={this.state.data_alpha}/>
                </div>
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

export default SuggestDetails;
