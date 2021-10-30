import React from 'react';
import PropTypes from 'prop-types';
import { NextSeo } from 'next-seo';

const propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

const defaultProps = {
  title: '',
  description: '',
};

const SeoHeader = ({ title, description }) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{
      title: `Jeserlin | ${title}`,
      description,
    }}
  />
);

SeoHeader.propTypes = propTypes;
SeoHeader.defaultProps = defaultProps;

export default SeoHeader;
