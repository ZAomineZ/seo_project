/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { BasicNotification } from '../../../../shared/components/Notification';
import NotificationSystem from 'rc-notification';

class ColorStates extends PureComponent {
  static propTypes = {
    showNotification: PropTypes.func.isRequired,
  };

    render() {
      return (
        <div>
          lol
        </div>
      );
    }
}

export default translate('common')(ColorStates);
