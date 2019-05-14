/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Badge } from 'reactstrap';
import CheckIcon from 'mdi-react/CheckIcon';
import PropTypes from 'prop-types';

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

    handleClick(event, title, check) {
        let data = this.state.data;
        let arr = Object.values(data);
        this.setState({
            data: arr.map((d) => {
                let array;
                array = d.map((dat) => {
                    if (dat.title === title) {
                        return {... dat, title: title, check: check}
                    }
                    return dat
                });
                return array;
            })
        });
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
        let data = this.state.data;
        let arr = Object.values(data);

        return (
            <div className="row">
            {
                arr.map((d) => (
                        <Col md={12} lg={12} xl={6}>
                            <Card>
                                <CardBody className="profile__card">
                                    <p className="profile__current-tasks-title">Alphabet Letter {
                                        d.slice(0, 1).map((dat) => {
                                            return dat.key
                                        })}
                                        <span>{ d.length }</span></p>
                                    <div className="profile__current-tasks">
                                        {
                                            d.map((data) => (
                                                <CheckDiv
                                                    checked={data.check}
                                                    title={data.title}
                                                    number={100}
                                                    onClick={event => this.handleClick(event, data.title, !data.check)}
                                                />
                                            ))
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                    </Col>
                ))
            }
            </div>
        );
    }
}
