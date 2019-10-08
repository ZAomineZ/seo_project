/* eslint-disable */
import React, {PureComponent} from 'react';
import {PlusIcon} from "mdi-react";
import * as PropTypes from "prop-types";
import {BasicNotification} from "../../shared/components/Notification";
import {translate} from "react-i18next";
import NotificationSystem from "rc-notification";
import axios from "axios";
import {route} from "../../const";
import BodyContent from "./BodyContent";
import ModalRank from "./ModalRank";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";

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

class BodyFormRank extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        dataKeywordsRank: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ])
    };

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalDelete: false,
            rankRoute: false,
            data: [],
            dataKeywordsRank: [],
            pageOfItems: [],
            webSite: '',
            project: '',
            description: '',
            keywords: '',
            loading: true,
            loaded: true,
            page: 0,
            rowsPerPage: 3
        };

        this.toggle = this.toggle.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
        this.handleChangeProject = this.handleChangeProject.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeKeywords = this.handleChangeKeywords.bind(this);
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: event.target.value});
    };

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

    handleChangeProject(event) {
        this.setState({project: event.target.value})
    }

    handleChangeWebsite(event) {
        this.setState({webSite: event.target.value})
    }

    handleChangeDescription(event) {
        this.setState({description: event.target.value})
    }

    handleChangeKeywords(event) {
        this.setState({keywords: event.target.value})
    }

    submitNotification(type, title, message) {
        NotificationSystem.newInstance({}, n => notification = n);
        setTimeout(() => showNotification(type, title, message), 700);
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
                this.setState({modal: !this.state.modal});
                setTimeout(() => this.setState({loaded: false}), 500);
                axios.get('http://' + window.location.hostname + route + '/Ajax/RankTo.php', {
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
                        website: this.state.webSite,
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
                            this.state.data.unshift(response.data.result);
                            this.state.dataKeywordsRank.unshift(response.data[0]);
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
            axios.get('http://' + window.location.hostname + route + '/Ajax/RankProjectDelete.php', {
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
                    id: id,
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
                        this.setState({modalDelete: !this.state.modalDelete})
                    } else {
                        this.setState({
                            modalDelete: !this.state.modalDelete,
                            data: this.state.data.filter(d => d.id !== id),
                            dataKeywordsRank: this.state.dataKeywordsRank.filter(d => d.id !== id)
                        });
                        this.submitNotification('success', '👋 Well Done !!!', 'Your project has been deleted !!!');
                        let form = document.getElementsByName("idFormDelete");
                        form.value = '';
                    }
                }
            });
        }
    }

    render() {
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
                <ModalRank toggle={this.toggle}
                           modal={this.state.modal}
                           onSubmit={e => this.onSubmit(e)}
                           project={this.state.project}
                           description={this.state.description}
                           website={this.state.webSite}
                           keywords={this.state.keywords}
                           handleChangeProject={this.handleChangeProject}
                           handleChangeWebsite={this.handleChangeWebsite}
                           handleChangeDescription={this.handleChangeDescription}
                           handleChangeKeywords={this.handleChangeKeywords}/>
                <div className='row'>
                    <form action="">
                        <input type="text" name='idFormDelete' hidden={true} value='' id='formDelete'/>
                    </form>
                    {
                        this.state.data
                            .slice(this.state.page * this.state.rowsPerPage, (this.state.page * this.state.rowsPerPage) + this.state.rowsPerPage)
                            .map((d) => {
                                return <BodyContent id={d.id}
                                                    project={d.project}
                                                    website={d.website}
                                                    date={d.created_at}
                                                    content={d.content}
                                                    keywords={d.keywords === null ? '' : d.keywords}
                                                    dataRankKeywords={d.dataKeywordsRank}
                                                    deleteProject={e => this.DeleteProject(e)}
                                                    modalDelete={this.state.modalDelete}
                                                    toggleDelete={this.toggleDelete}/>
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
