/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Badge } from 'reactstrap';
import CheckIcon from 'mdi-react/CheckIcon';
import PropTypes from 'prop-types';
import Modal from "./modal";

export default class ProfileTasks extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    componentWillReceiveProps(nextProps) {
        // This will erase any local state updates!
        // Do not do this.
        this.setState({ data: nextProps.data });
    }

    handleClick(event, id) {
        this.setState({ data: this.state.data.map((d, key) => {
                if (key === id) {
                    return {
                        title: d.title,
                        check: !d.check,
                    };
                }
                return d;
            })
        })
    }

    render() {
        const CheckDiv = ({
                              checked, title, number, onClick,
                          }) => (
            <div className={checked === true ? 'profile__current-task checkbox-bar' : 'profile__current-task'}>
                <label className="checkbox-btn profile__current-task-checkbox">
                    <input
                        className="checkbox-btn__checkbox"
                        type="checkbox"
                        defaultChecked={checked}
                        onClick={onClick}
                    />
                    <span className="checkbox-btn__checkbox-custom">
              <CheckIcon />
            </span>
                </label>
                { title }
                <Badge color="info">
                    { number }
                </Badge>
            </div>
        );

        CheckDiv.propTypes = {
            checked: PropTypes.bool,
            title: PropTypes.string.isRequired,
            number: PropTypes.number.isRequired,
            onClick: PropTypes.func.isRequired,
        };

        CheckDiv.defaultProps = {
            checked: false,
        };
        return (
            <Col md={12} lg={12} xl={6}>
                <Card>
                    <CardBody className="profile__card">
                        <p className="profile__current-tasks-title">Comparisons tasks <span>{ this.state.data.length }</span></p>
                        <div className="profile__current-tasks">
                            {
                                this.state.data.slice(0, 10).map((d, key) => (
                                    <CheckDiv
                                        checked={d.check}
                                        title={d.title}
                                        number={100}
                                        onClick={event => this.handleClick(event, key)}
                                    />
                                ))
                            }
                            {
                                this.state.data.length > 10 ? <Modal value={this.state.value}
                                                                     onChange={this.onChange}
                                                                     onSubmit={e => this.handleSubmit(e, d.id, d.website)}
                                                                     title="Current Keyword"
                                                                     data={this.props.data}
                                                                     btn="See More"/>
                                    : ''
                            }
                        </div>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}
