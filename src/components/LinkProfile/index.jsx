/* eslint-disable */
import React, { PureComponent } from 'react';
import Form from './form';
import NotificationMessage from "../../js/NotificationMessage";

class Link extends PureComponent {
    componentDidMount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                return NotificationMessage.notification('This Url is invalid !!!', '👋 A Error is present !!!', 'danger')
            }
        }
    }

    componentWillUnmount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                return NotificationMessage.destroy();
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
