import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Panel from '../../../../shared/components/Panel';
import TabLinkProfile from '../../../../components/LinkProfile/tab_linkprofile';

const DefaultPanelDivider = ({ t, domain }) => (
  <Panel xs={12} md={12} lg={6} divider title={t('Link')} serpFeature={[]}>
    <TabLinkProfile domain={domain} />
  </Panel>
);

DefaultPanelDivider.propTypes = {
  t: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
};

export default translate('common')(DefaultPanelDivider);
