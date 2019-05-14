import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Panel from '../../../../shared/components/Panel';

const LabelPanelDivider = ({ t }) => (
  <Panel xs={12} md={12} lg={6} divider title={t('ui_elements.panels.label_panel_divider')} label="label">
    <ul>
      <li>
        <p>LOLOLOL</p>
      </li>
      <li>
        <p>LOLOLOL</p>
      </li>
      <li>
        <p>LOLOLOL</p>
      </li>
    </ul>
  </Panel>
);

LabelPanelDivider.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate('common')(LabelPanelDivider);
