/* eslint-disable */
import React, {PureComponent} from 'react';
import {PlusIcon} from "mdi-react";
import * as PropTypes from "prop-types";
import {translate} from "react-i18next";
import axios from "axios";
import {route, requestUri} from "../../const";
import BodyContent from "./BodyContent";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import {Button, ButtonToolbar, Modal} from "reactstrap";
import {Redirect} from "react-router-dom";
import ResponseAjax from "../../js/ResponseAjax";
import Cookie from '../../js/Cookie'
import NotificationMessage from "../../js/NotificationMessage";

class BodyFormRank extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        dataKeywordsRank: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        history: PropTypes.object
    };

    constructor() {
        super();
        this.state = {
            webSite: '',
            project: '',
            description: '',
            keywords: '',
            modal: false,
            modalDelete: false,
            rankRoute: false,
            data: [],
            dataKeywordsRank: [],
            pageOfItems: [],
            loading: true,
            loaded: true,
            page: 0,
            rowsPerPage: 3,
            errorMess: '',
            errorStatus: false,
            redirectSerp: false
        };
        this.handleChangeProject = this.handleChangeProject.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeKeywords = this.handleChangeKeywords.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
        this.ErrorRenderState = this.ErrorRenderState.bind(this);
    }

    ErrorRenderState() {
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.state.webSite === '' || !urlRegex.test(this.state.webSite)) {
            this.setState({errorMess: 'Url field is Invalid !!!'});
            this.setState({errorStatus: !this.state.errorStatus})
        } else {
            this.setState({errorStatus: false})
        }
    }

    handleChangeProject(event) {
        this.setState({project: event.target.value});
    }

    handleChangeWebsite(event) {
        this.setState({webSite: event.target.value});
    }

    handleChangeDescription(event) {
        this.setState({description: event.target.value});
    }

    handleChangeKeywords(event) {
        this.setState({keywords: event.target.value});
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: event.target.value});
    };

    toggle() {
        this.setState({modal: !this.state.modal})
    }

    submitNotification(type, title, message) {
        return NotificationMessage.notification(message, title, type);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let data = nextProps.data.map((d, k) => {
            return {
                content: d.content,
                created_at: d.created_at,
                id: d.id,
                keywords: d.keywords,
                project: d.project,
                user_id: d.user_id,
                website: d.website,
                dataKeywordsRank: nextProps.dataKeywordsRank[k]
            }
        });
        this.setState({
            data: data,
            dataKeywordsRank: nextProps.dataKeywordsRank
        })
    }

    toggleDelete() {
        let form = document.getElementsByName("idFormDelete");
        form.value = '';
        this.setState({modalDelete: !this.state.modalDelete})
    }

    onSubmit(e) {
        e.preventDefault();
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.state.webSite !== '' && this.state.project !== '' && this.state.description !== '' && urlRegex.test(this.state.webSite)) {
            if (this.state.description.length > 10) {
                // Enjoy Params With Get Axios !!!
                this.loadedResponseNewProject();

                const formData = new FormData();
                formData.set('website', this.state.webSite);
                formData.set('project', this.state.project);
                formData.set('content', this.state.description);
                formData.set('keywords', this.state.keywords ? this.state.keywords : '');
                formData.set('cookie', Cookie.getCookie('remember_me_auth') ?
                    Cookie.getCookie('remember_me_auth') :
                    Cookie.getCookie('auth_today'));
                formData.set('auth', sessionStorage.getItem('Auth') ?
                    sessionStorage.getItem('Auth')
                    : '');

                axios.post(requestUri + window.location.hostname + route + '/Ajax/RankTo.php', formData, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                        'Access-Control-Allow-Credentials': true,
                        'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                        'Access-Control-Max-Age': 1728000,
                        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
                    }
                }).then((response) => {
                    if (response && response.status === 200) {
                        if (response.data.error) {
                            if (response.data.error === 'Invalid Token') {
                                return this.redirectSerp(response)
                            } else {
                                this.submitNotification('danger', '👋 Error Found !!!', response.data.error);
                                this.setState({loading: false});
                                setTimeout(() => this.setState({loaded: true}), 500);
                            }
                        } else {
                            this.state.data.unshift(response.data.result);
                            this.state.dataKeywordsRank.unshift(response.data[0][0]);
                            this.submitNotification('success', '👋 Well Done !!!', 'You are create your project with success !!!');
                            this.setState({
                                rankRoute: !this.state.rankRoute,
                                data: this.state.data.map((d, k) => {
                                    return {
                                        content: d.content,
                                        created_at: d.created_at,
                                        id: d.id,
                                        keywords: d.keywords,
                                        project: d.project,
                                        user_id: d.user_id,
                                        website: d.website,
                                        dataKeywordsRank: this.state.dataKeywordsRank[k]
                                    }
                                }),
                                dataKeywordsRank: this.state.dataKeywordsRank,
                                loading: false
                            });
                            setTimeout(() => this.setState({loaded: true}), 500);
                        }
                    }
                });
            } else {
                this.submitNotification('danger', '👋 A Error is Present !!!', 'The Field Descrition is so short !!!');
                this.setState({modal: !this.state.modal})
            }
        } else {
            // Enjoy Notification Error
            this.submitNotification('danger', '👋 A Error is Present !!!', 'This Fiels are incorrect or empty !!!');
            this.setState({modal: !this.state.modal})
        }
    }

    DeleteProject(e) {
        e.preventDefault();
        let id = document.getElementsByName("idFormDelete").value;
        if (id !== '') {
            this.setState({loaded: false});

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
                id: id,
                cookie: Cookie.getCookie('remember_me_auth') ?
                    Cookie.getCookie('remember_me_auth') :
                    Cookie.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ?
                    sessionStorage.getItem('Auth')
                    : ''
            };

            axios.get(requestUri + window.location.hostname + route + '/Ajax/RankProjectDelete.php', {
                headers: headers,
                params: params,
            }).then((response) => {
                if (response && response.status === 200) {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            return this.redirectSerp(response)
                        } else {
                            this.submitNotification('danger', '👋 Error Found !!!', response.data.error);
                            this.setState({modalDelete: !this.state.modalDelete})
                        }
                    } else {
                        this.setState({
                            modalDelete: !this.state.modalDelete,
                            data: this.state.data.filter(d => d.id !== id),
                            dataKeywordsRank: this.state.dataKeywordsRank.filter(d => d.id !== id)
                        });
                        setTimeout(() => this.setState({loaded: true}), 500);

                        this.submitNotification('success', '👋 Well Done !!!', 'Your project has been deleted !!!');

                        let form = document.getElementsByName("idFormDelete");
                        form.value = '';
                    }
                }
            });
        }
    }

    /**
     * @param {object} response
     */
    redirectSerp(response) {
        ResponseAjax.ForbiddenResponse(response);
        this.setState({redirectSerp: !this.state.redirectSerp});
    }

    loadedResponseNewProject() {
        this.setState({modal: !this.state.modal});
        setTimeout(() => this.setState({loaded: false}), 500);
    }

    render() {
        if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            )
        }
        return (
            <div className='project-new'>
                {!this.state.loaded &&
                <div className={`load${this.state.loading ? '' : ' loaded'}`}>
                    <div className="load__icon-wrap">
                        <svg className="load__icon">
                            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                        </svg>
                    </div>
                </div>
                }
                <div className='btnAddWeb'>
                    <button className="btn btn-primary" onClick={this.toggle}><PlusIcon/> {this.props.name}</button>
                </div>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className='modalClasses modalWebSite'
                >
                    <form className='form' onSubmit={e => this.onSubmit(e)}>
                        <div className="form__form-group">
                            <span className="form__form-group-label typography-message">Your new Project</span>
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
                            <span className="form__form-group-label typography-message">Your new Website</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
                                    <input
                                        type='url'
                                        name='url'
                                        placeholder="https://themeforest.net"
                                        required
                                        value={this.state.webSite}
                                        onChange={this.handleChangeWebsite}
                                        onKeyDownCapture={this.ErrorRenderState}
                                        onClick={this.ErrorRenderState}
                                        onBlur={this.ErrorRenderState}
                                    />
                                    {this.state.errorStatus ?
                                        <span className="form__form-group-error">{this.state.errorMess}</span>
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="form__form-group">
                            <span className="form__form-group-label typography-message">Your new Description</span>
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
                            <span className="form__form-group-label typography-message">Yours new Keywords</span>
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
                <div className='row'>
                    <form action="">
                        <input type="text" name='idFormDelete' hidden={true} value='' id='formDelete'/>
                    </form>
                    {this.state.data
                        .slice(this.state.page * this.state.rowsPerPage, (this.state.page * this.state.rowsPerPage) + this.state.rowsPerPage)
                        .map((d) => {
                            return (
                                <BodyContent id={d.id}
                                             project={d.project}
                                             website={d.website}
                                             date={d.created_at}
                                             content={d.content}
                                             keywords={d.keywords === null ? '' : d.keywords}
                                             dataRankKeywords={d.dataKeywordsRank}
                                             deleteProject={e => this.DeleteProject(e)}
                                             modalDelete={this.state.modalDelete}
                                             modal={this.state.modal}
                                             history={this.props.history}
                                             toggleDelete={this.toggleDelete}/>
                            )
                        })
                    }
                    <div className="col-md-3">
                        <div className="pagination">
                            {
                                this.state.data.length !== 0 ? <TablePagination
                                    component="div"
                                    className="material-table__pagination"
                                    count={this.state.data.length}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.page}
                                    backIconButtonProps={{'aria-label': 'Previous Page'}}
                                    nextIconButtonProps={{'aria-label': 'Next Page'}}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    rowsPerPageOptions={[1, 2, 3]}
                                /> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (translate('common'))(BodyFormRank);
