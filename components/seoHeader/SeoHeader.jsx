/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
// import { NextSeo } from 'next-seo';

const propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

// eslint-disable-next-line no-unused-vars
const SeoHeader = ({ title = '', description = '' }) => (
  <div />
  // <NextSeo
  //   title={title}
  //   description={description}
  //   openGraph={{
  //     title: `Jeserlin | ${title}`,
  //     description,
  //   }}
  // />
);

SeoHeader.propTypes = propTypes;

export default SeoHeader;
