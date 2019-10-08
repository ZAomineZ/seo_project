/* eslint-disable */
import {Field, reduxForm} from "redux-form";
import React, {PureComponent} from "react";
import * as PropTypes from "prop-types";
import validate from "../../containers/Form/FormValidation/components/validate";
import {Modal, Button, ButtonToolbar} from "reactstrap";
import {translate} from "react-i18next";

const renderField = ({
                         input, placeholder, valueInput, onChangeInput, type, meta: {touched, error},
                     }) => {
    return (
        <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
            <input {...input} placeholder={placeholder} type={type} value={valueInput} onChange={onChangeInput} />
            {touched && error && <span className="form__form-group-error">{error}</span>}
        </div>
    )
};

renderField.propTypes = {
    input: PropTypes.shape().isRequired,
    valueInput: PropTypes.string,
    onChangeInput: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }),
};

renderField.defaultProps = {
    placeholder: '',
    meta: null,
    type: 'text',
    valueInput: ''
};

class ModalRank extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            errorMess: '',
            errorStatus: false
        };
        this.ErrorRenderState = this.ErrorRenderState.bind(this)
    }

    static propTypes = {
        modal: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        project: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        keywords: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        handleChangeProject: PropTypes.func.isRequired,
        handleChangeWebsite: PropTypes.func.isRequired,
        handleChangeDescription: PropTypes.func.isRequired,
        handleChangeKeywords: PropTypes.func.isRequired
    };

    ErrorRenderState()
    {
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.props.website === '' || !urlRegex.test(this.props.website)){
            this.setState({errorMess: 'Url field is Invalid !!!'});
            this.setState({errorStatus: !this.state.errorStatus})
        } else {
            this.setState({errorStatus: false})
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.modal}
                toggle={this.props.toggle}
                className='modalClasses modalWebSite'
            >
                <form className='form' onSubmit={this.props.onSubmit}>
                    <div className="form__form-group">
                        <span className="form__form-group-label typography-message">Your new Project</span>
                        <div className="form__form-group-field">
                            <input
                                type="text"
                                name='project'
                                placeholder="Your Project.."
                                required
                                value={this.props.project}
                                onChange={this.props.handleChangeProject}
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
                                    value={this.props.website}
                                    onChange={this.props.handleChangeWebsite}
                                    onKeyDownCapture={this.ErrorRenderState}
                                    onClick={this.ErrorRenderState}
                                    onBlur={this.ErrorRenderState}
                                />
                                { this.state.errorStatus ?
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
                                        value={this.props.description}
                                        className='border-textarea'
                                        onChange={this.props.handleChangeDescription}
                                    />
                        </div>
                    </div>
                    <div className="form__form-group">
                        <span className="form__form-group-label typography-message">Yours new Keywords</span>
                        <div className="form__form-group-field">
                                    <textarea
                                        placeholder="Yours Keywords.."
                                        name='keywords'
                                        value={this.props.keywords}
                                        className='border-textarea'
                                        onChange={this.props.handleChangeKeywords}
                                    />
                        </div>
                    </div>

                    <ButtonToolbar className="form__button-toolbar">
                        <Button color="primary" type="submit">Add</Button>
                        <Button type="button" onClick={this.props.toggle}>Cancel</Button>
                    </ButtonToolbar>
                </form>
            </Modal>
        );
    }
}

export default reduxForm({
    form: 'form_project_rank',
    validate
})(translate('common')(ModalRank))


