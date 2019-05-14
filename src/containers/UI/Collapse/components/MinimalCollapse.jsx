/* eslint-disable */
import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Collapse from '../../../../shared/components/Collapse';

const MinimalCollapse = ({ url, description, title }) => (
  <div>
    <Collapse title="Other information">
      <div className="">
        <p className="search-result__title">{ title }</p>
        <p
          className="search-result__link"
        >
          <a href={url} target='_blank'>{ url }</a>
        </p>
        <p
          className="search-result__preview"
        >
          { description }
        </p>
      </div>
    </Collapse>
  </div>
);

MinimalCollapse.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default translate('common')(MinimalCollapse);
