/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import {Button, Card, CardBody, Col, ButtonToolbar, Modal} from "reactstrap";
import StatsRankChart from "./StatsRankChart";
import axios from "axios";
import {route, requestUri} from "../../const";
import ModalRankDelete from "./ModalRankDelete";
import {Redirect} from "react-router-dom";
import Cookie from "../../js/Cookie"
import ResponseAjax from "../../js/ResponseAjax";
import NotificationMessage from "../../js/NotificationMessage";

export default class RankFront extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            dataKeywords: [],

            id: '',
            project: '',
            website: '',
            description: '',
            keywords: '',
            date: '',

            loading: true,
            loaded: true,
            errorMess: '',
            errorStatus: false,
            redirectSerp: false,
            errorDuplicateKeyword: false
        };
        this.toggle = this.toggle.bind(this);
        this.handleChangeProject = this.handleChangeProject.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeKeywords = this.handleChangeKeywords.bind(this);
        this.ErrorRenderState = this.ErrorRenderState.bind(this);
    }

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
        modal: PropTypes.bool.isRequired,
        history: PropTypes.object,
        modalDelete: PropTypes.bool.isRequired,
        toggleDelete: PropTypes.func.isRequired,
        deleteProject: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.reloadProps(this.props)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.dataRankKeywords) {
            this.reloadProps(nextProps)
        }
    }

    reloadProps(nextProps)
    {
        this.setState({
            id: nextProps.id,
            project: nextProps.project,
            website: nextProps.website,
            description: nextProps.content,
            keywords: nextProps.keywords,
            date: nextProps.date,
            dataKeywords: nextProps.dataRankKeywords,
            loading: false
        });
    }

    ErrorRenderState() {
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.state.website === '' || !urlRegex.test(this.state.website)) {
            this.setState({errorMess: 'Url field is Invalid !!!'});
            this.setState({errorStatus: !this.state.errorStatus})
        } else {
            this.setState({errorStatus: false})
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

    submitNotification(type, title, message) {
        return NotificationMessage.notification(message, title, type);
    }

    toggle() {
        this.setState({modal: !this.state.modal})
    }

    toggleClick(e, id, modalType = '') {
        e.preventDefault();
        if (id !== '' && modalType !== 'deleteModal') {
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
                id: this.state.id,
                cookie: Cookie.getCookie('remember_me_auth') ?
                    Cookie.getCookie('remember_me_auth') :
                    Cookie.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ?
                    sessionStorage.getItem('Auth')
                    : ''
            };

            axios.get(requestUri + window.location.hostname + route + '/Ajax/RankProjectId.php', {
                headers: headers,
                params: params,
            }).then((response) => {
                if (response.data && response.status === 200) {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            return this.redirectSerp(response)
                        }
                    } else {
                        const errorDuplicateKeyword = this.state.errorDuplicateKeyword;

                        this.setState({
                            website: response.data.website,
                            description: response.data.content,
                            project: response.data.project,
                            keywords: errorDuplicateKeyword ? this.state.keywords : response.data.keywords
                        });
                    }
                }
            })
        }
        return this.modalToggle(modalType)
    }

    onSubmit(event) {
        event.preventDefault();
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.state.website !== '' && this.state.project !== '' && this.state.description !== '' && urlRegex.test(this.state.website)) {
            if (this.state.description.length > 10) {
                this.loadResponseUpdateProject();

                const formData = new FormData();
                formData.set('id', this.state.id);
                formData.set('website', this.state.website);
                formData.set('project', this.state.project);
                formData.set('content', this.state.description);
                formData.set('keywords', this.state.keywords ? this.state.keywords : '');
                formData.set('cookie', Cookie.getCookie('remember_me_auth') ?
                    Cookie.getCookie('remember_me_auth') :
                    Cookie.getCookie('auth_today'));
                formData.set('auth', sessionStorage.getItem('Auth') ?
                    sessionStorage.getItem('Auth')
                    : '');

                axios.post(requestUri + window.location.hostname + route + '/Ajax/RankProjectUpdate.php', formData, {
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
                    if (response && response.status === 200) {
                        if (response.data.error) {
                            if (response.data.error === 'Invalid Token') {
                                return this.redirectSerp(response)
                            } else {
                                this.submitNotification('danger', '👋 Error Found !!!', response.data.error);

                                this.setState({
                                    keywords: response.data.keywords,
                                    errorDuplicateKeyword: true
                                });
                                setTimeout(() => this.setState({loaded: true}), 500);
                            }
                        } else {
                            const {history} = this.props;
                            const Slugify = require('slugifyjs').fromLocale('en');

                            this.setState({
                                id: response.data.result.id,
                                project: response.data.result.project,
                                website: response.data.result.website,
                                description: response.data.result.content,
                                keywords: response.data.result.keywords,
                                date: response.data.result.created_at,
                                dataKeywords: response.data[0][0],
                                loading: false
                            });
                            setTimeout(() => this.setState({loaded: true}), 500);

                            this.submitNotification('success', '👋 Well Done !!!', 'You updated your project with success !!!');
                            history.push('/seo/rankTo/' + Slugify.parse(this.props.project))
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

    loadResponseUpdateProject() {
        this.setState({modal: !this.state.modal});
        this.setState({loaded: !this.state.loaded});
    }

    /**
     * @param {object} response
     */
    redirectSerp(response) {
        ResponseAjax.ForbiddenResponse(response);
        this.setState({redirectSerp: !this.state.redirectSerp});
    }

    /**
     *
     * @param {string} modalType
     */
    modalToggle(modalType) {
        if (modalType === 'deleteModal') {
            this.props.toggleDelete();
            let form = document.getElementsByName("idFormDelete");
            form.value = this.props.id;
        } else {
            this.setState({modal: !this.state.modal});
        }
    }

    render() {
        const dataR = this.state.dataKeywords !== undefined ? Object.values(this.state.dataKeywords) : [];

        let moment = require('moment');
        let Slugify = require('slugifyjs').fromLocale('en');

        if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            )
        }

        return (
            <Col md={12} lg={12} xl={12}>
                <Card>
                    {!this.state.loaded &&
                    <div className="panel__refresh">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                        </svg>
                    </div>
                    }
                    <CardBody>
                        <div className="project-summary">
                            <div className="card__title project-summary__card-title">
                                <h5 className="bold-text">Project {this.props.project}</h5>
                                <Button className="project-summary__btn btn-right" outline size="sm"
                                        onClick={e => this.toggleClick(e, this.props.id)}>Edit</Button>
                                <Button className="project-summary__btn" color='danger' outline size="sm"
                                        onClick={e => this.toggleClick(e, this.props.id, 'deleteModal')}>Delete</Button>
                            </div>
                            <Modal
                                isOpen={this.state.modal}
                                toggle={this.toggle}
                                className='modalClasses modalWebSite'
                            >
                                <form className='form' onSubmit={e => this.onSubmit(e)}>
                                    <div className="form__form-group">
                                        <span
                                            className="form__form-group-label typography-message">Your new Project</span>
                                        <div className="form__form-group-field">
                                            <input
                                                type="text"
                                                name='project'
                                                placeholder="Your Project.."
                                                required
                                                value={this.state.project}
                                                onChange={this.handleChangeProject}
                                            />
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span
                                            className="form__form-group-label typography-message">Your new Website</span>
                                        <div className="form__form-group-field">
                                            <div
                                                className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
                                                <input
                                                    type='url'
                                                    name='url'
                                                    placeholder="https://themeforest.net"
                                                    required
                                                    value={this.state.website}
                                                    onChange={this.handleChangeWebsite}
                                                    onKeyDownCapture={this.ErrorRenderState}
                                                    onClick={this.ErrorRenderState}
                                                    onBlur={this.ErrorRenderState}
                                                />
                                                {this.state.errorStatus ?
                                                    <span
                                                        className="form__form-group-error">{this.state.errorMess}</span>
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span
                                            className="form__form-group-label typography-message">Your new Description</span>
                                        <div className="form__form-group-field">
                                    <textarea
                                        placeholder="Your Description.."
                                        required
                                        name='content'
                                        value={this.state.description}
                                        className='border-textarea'
                                        onChange={this.handleChangeDescription}
                                    />
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span
                                            className="form__form-group-label typography-message">Yours new Keywords</span>
                                        <div className="form__form-group-field">
                                    <textarea
                                        placeholder="Yours Keywords.."
                                        name='keywords'
                                        value={this.state.keywords}
                                        className='border-textarea'
                                        onChange={this.handleChangeKeywords}
                                    />
                                        </div>
                                    </div>

                                    <ButtonToolbar className="form__button-toolbar">
                                        <Button color="primary" type="submit">Add</Button>
                                        <Button type="button" onClick={this.toggle}>Cancel</Button>
                                    </ButtonToolbar>
                                </form>
                            </Modal>
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
                                                : ''
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Website Url:</th>
                                    <td>{this.state.website !== '' ? this.state.website : ''}</td>
                                </tr>
                                <tr>
                                    <th>Due date:</th>
                                    <td>{this.state.date ? moment(this.state.date).format('LLL') : ''}</td>
                                </tr>
                                </tbody>
                            </table>
                            <p className="typography-message">{this.state.description !== '' ? this.state.description : ''}</p>
                            {
                                !this.props.modal && !this.state.modal ?
                                    this.state.dataKeywords === undefined ? '' :
                                        this.state.dataKeywords && this.state.dataKeywords.length !== 0 ?
                                            <hr/> : dataR && dataR.length !== 0 && dataR[0].length !== 0 && dataR[1].length !== 0 ?
                                            <hr/> : '' : ''
                            }
                            {
                                !this.props.modal && !this.state.modal ?
                                    this.state.dataKeywords && this.state.dataKeywords.length !== 0 ?
                                        <StatsRankChart id={this.state.id}
                                                        dataResultRank={this.state.dataKeywords}/> : dataR && dataR.length !== 0 ?
                                        <StatsRankChart id={this.state.id}
                                                        dataResultRank={dataR}/> : '' : ''
                            }
                        </div>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}
