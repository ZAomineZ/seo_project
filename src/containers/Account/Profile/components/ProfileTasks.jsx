/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Badge } from 'reactstrap';
import CheckIcon from 'mdi-react/CheckIcon';
import PropTypes from 'prop-types';

export default class ProfileTasks extends PureComponent {
    state = {
      data: [
        {
          id: 1,
          title: 'Coloriage animaux',
          number: 100,
          checking: false,
        },
        {
          id: 2,
          title: 'Coloriage Manga',
          number: 256,
          checking: false,
        },
        {
          id: 3,
          title: 'Coloriage magique',
          number: 125,
          checking: false,
        },
        {
          id: 4,
          title: 'Coloriage poupée',
          number: 56,
          checking: false,
        },
        {
          id: 5,
          title: 'Coloriage tasse',
          number: 569,
          checking: false,
        },
      ],
    };

    handleClick(event, id) {
      this.setState({
        data: this.state.data.map((data) => {
          if (data.id === id) {
            return {
              id: data.id,
              title: data.title,
              number: data.number,
              checking: !data.checking,
            };
          }
          return data;
        }),
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
      const { data } = this.state;
      return (
        <Col md={12} lg={12} xl={12}>
          <Card>
            <CardBody className="profile__card">
              <p className="profile__current-tasks-title">Current tasks <span>{ this.state.data.length }</span></p>
              <div className="profile__current-tasks">
                {
                  data.map(d => (
                    <CheckDiv
                      checked={d.checking}
                      title={d.title}
                      number={d.number}
                      onClick={event => this.handleClick(event, d.id)}
                    />
                    ))
                }
                <a href="/" className="profile__see-all-tasks">See all tasks</a>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    }
}
