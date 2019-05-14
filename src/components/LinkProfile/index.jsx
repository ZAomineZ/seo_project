/* eslint-disable */
import React, { PureComponent } from 'react';
import Form from './form';
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";

let notification = null;

const showNotification = () => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title="👋 A Error is present !!!"
            message="This Url is invalid !!!"
        />,
        duration: 5,
        closable: true,
        style: { top: 0, left: 'calc(100vw - 100%)' },
        className: 'left-up',
    });
};

class Link extends PureComponent {
    componentDidMount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification(), 700);
            }
        }
    }

    componentWillUnmount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                notification.destroy();
            }
        }
    }

  render() {
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col-md-12">
            <h3 className="page-title">Link Profile</h3>
          </div>
        </div>
        <div className="row">
          <Form location={this.props.location.pathname} />
        </div>
      </div>
    );
  }
}
export default Link;
