/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import {Button, Card, CardBody, Col, Progress} from "reactstrap";
import StatsRankChart from "./StatsRankChart";
import ModalRank from "./ModalRank";
import axios from "axios";
import {route} from "../../const";
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import ModalRankDelete from "./ModalRankDelete";

let notification = null;

const showNotification = (type, title, message) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={title}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class RankFront extends PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        keywords: PropTypes.string.isRequired,
        dataRankKeywords: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        modalDelete: PropTypes.bool.isRequired,
        toggleDelete: PropTypes.func.isRequired,
        deleteProject: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            modal: false,
            dataKeywords: [],
            project: '',
            website: '',
            description: '',
            keywords: '',
            date: '',
            loading: true,
            loaded: true
        };
        this.toggle = this.toggle.bind(this);
        this.handleChangeProject = this.handleChangeProject.bind(this);
        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeKeywords = this.handleChangeKeywords.bind(this);
    }

    submitNotification(type, title, message) {
        NotificationSystem.newInstance({}, n => notification = n);
        setTimeout(() => showNotification(type, title, message), 700);
    }

    /**
     * Create cookie User Auth If We reseted The Cookie in progress !!!
     * @param name_cookie
     * @param value_cookie
     * @param expire_days
     * @returns {string}
     * @constructor
     */
    SetCookie(name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    /**
     * Recuperate Cookie User
     * @param name_cookie
     * @returns {string}
     */
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

    /**
     * Reset Cookie User When Invalid Token found in the Request Ajax with Axios
     * @param token
     * @param id
     * @constructor
     */
    CookieReset(token, id) {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    toggle() {
        this.setState({modal: !this.state.modal})
    }

    toggleClick(e, id, modalType = '') {
        e.preventDefault();
        if (id !== '' && modalType !== 'deleteModal') {
            axios.get('http://' + window.location.hostname + route + '/Ajax/RankProjectId.php', {
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
                    id: this.props.id,
                    cookie: this.getCookie('remember_me_auth') ?
                        this.getCookie('remember_me_auth') :
                        this.getCookie('auth_today'),
                    auth: sessionStorage.getItem('Auth') ?
                        sessionStorage.getItem('Auth')
                        : ''
                }
            }).then((response) => {
                if (response.data && response.status === 200) {
                    this.setState({
                        website: response.data.website,
                        description: response.data.content,
                        project: response.data.project,
                        keywords: response.data.keywords
                    });
                }
            })
        }
        if (modalType === 'deleteModal') {
            this.props.toggleDelete();
            let form = document.getElementsByName("idFormDelete");
            form.value = this.props.id;
        } else {
            this.setState({modal: !this.state.modal});
        }
    }

    onSubmit(event) {
        event.preventDefault();
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.state.website !== '' && this.state.project !== '' && this.state.description !== '' && urlRegex.test(this.state.website)) {
            if (this.state.description.length > 10) {
                this.setState({modal: !this.state.modal});
                setTimeout(() => this.setState({loaded: false}), 500);
                axios.get('http://' + window.location.hostname + route + '/Ajax/RankProjectUpdate.php', {
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
                        id: this.props.id,
                        website: this.state.website,
                        project: this.state.project,
                        content: this.state.description,
                        keywords: this.state.keywords ? this.state.keywords : '',
                        cookie: this.getCookie('remember_me_auth') ?
                            this.getCookie('remember_me_auth') :
                            this.getCookie('auth_today'),
                        auth: sessionStorage.getItem('Auth') ?
                            sessionStorage.getItem('Auth')
                            : ''
                    }
                }).then((response) => {
                    if (response && response.status === 200) {
                        if (response.data.error) {
                            this.submitNotification('danger', '👋 Error Found !!!', response.data.error);
                            this.setState({loading: false});
                            setTimeout(() => this.setState({loaded: true}), 500);
                        } else {
                            this.setState({
                                project: response.data.result.project,
                                website: response.data.result.website,
                                description: response.data.result.description,
                                keywords: response.data.result.keywords,
                                date: response.data.result.date,
                                dataKeywords: response.data[0],
                                loading: false
                            });
                            setTimeout(() => this.setState({loaded: true}), 500);
                            this.submitNotification('success', '👋 Well Done !!!', 'You updated your project with success !!!');
                        }
                    }
                });
            } else {
                this.submitNotification('danger', '👋 A Error is Present !!!', 'The Field Descrition is so short !!!');
                this.setState({modal: !this.state.modal});
            }
        } else {
            this.submitNotification('danger', '👋 A Error is Present !!!', 'This Fiels are incorrect or empty !!!');
            this.setState({modal: !this.state.modal});
        }
    }

    handleChangeProject(event) {
        this.setState({project: event.target.value})
    }

    handleChangeWebsite(event) {
        this.setState({website: event.target.value})
    }

    handleChangeDescription(event) {
        this.setState({description: event.target.value})
    }

    handleChangeKeywords(event) {
        this.setState({keywords: event.target.value})
    }

    render() {
        const dataR = Object.values(this.props.dataRankKeywords);
        let moment = require('moment');
        let Slugify = require('slugifyjs').fromLocale('en');

        return (
            <Col md={12} lg={12} xl={12}>
                <Card>
                    {!this.state.loaded &&
                    <div className={`load${this.state.loading ? '' : ' loaded'}`}>
                        <div className="load__icon-wrap">
                            <svg className="load__icon">
                                <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                            </svg>
                        </div>
                    </div>
                    }
                    <CardBody>
                        <div className="project-summary">
                            <div className="card__title project-summary__card-title">
                                <h5 className="bold-text">Project {this.props.project}</h5>
                                <Button className="project-summary__btn btn-right" color='danger' outline size="sm"
                                        onClick={e => this.toggleClick(e, this.props.id, 'deleteModal')}>Delete</Button>
                                <Button className="project-summary__btn" outline size="sm"
                                        onClick={e => this.toggleClick(e, this.props.id)}>Edit</Button>
                            </div>
                            <ModalRank toggle={this.toggle}
                                       modal={this.state.modal}
                                       keywords={this.state.keywords}
                                       description={this.state.description}
                                       project={this.state.project}
                                       website={this.state.website}
                                       handleChangeKeywords={this.handleChangeKeywords}
                                       handleChangeDescription={this.handleChangeDescription}
                                       handleChangeWebsite={this.handleChangeWebsite}
                                       handleChangeProject={this.handleChangeProject}
                                       onSubmit={e => this.onSubmit(e)}
                            />
                            <ModalRankDelete
                                message='Are you sure to delete this project ?!'
                                toggle={this.props.toggleDelete}
                                modalDelete={this.props.modalDelete}
                                deleteProject={this.props.deleteProject}/>
                            <table className="project-summary__info">
                                <tbody>
                                <tr>
                                    <th>Project owner:</th>
                                    <td>
                                        {
                                            this.state.project !== '' ?
                                                <a href={"/seo/rankTo/" + Slugify.parse(this.state.project)}>
                                                    {this.state.project}
                                                </a>
                                            :
                                                <a href={"/seo/rankTo/" + Slugify.parse(this.props.project)}>
                                                    { this.props.project}
                                                </a>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Website Url:</th>
                                    <td>{this.state.website !== '' ? this.state.website : this.props.website}</td>
                                </tr>
                                <tr>
                                    <th>Due date:</th>
                                    <td>{this.state.date ? moment(this.state.date).format('LLL') : moment(this.props.date).format('LLL')}</td>
                                </tr>
                                </tbody>
                            </table>
                            <p className="typography-message">{this.state.content !== '' ? this.state.content : this.props.content}</p>
                            {
                                this.state.dataRankKeywords === undefined ? '' :
                                    this.state.dataKeywords && this.state.dataKeywords.length !== 0 ?
                                        <hr/> : dataR && dataR.length !== 0 && dataR[0].length !== 0 && dataR[1].length !== 0 ?
                                        <hr/> : ''
                            }
                            {
                                this.state.dataKeywords && this.state.dataKeywords.length !== 0 ?
                                    <StatsRankChart id={this.props.id}
                                                    dataResultRank={this.state.dataKeywords}/> : dataR && dataR.length !== 0 ?
                                    <StatsRankChart id={this.props.id}
                                                    dataResultRank={dataR}/> : ''
                            }
                        </div>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}
