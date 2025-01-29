/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string,
};

const PostHeader = ({ title = '' }) => (
  <div className="mb-4">
    <h1 className="text-base-200">
      {title}
    </h1>
  </div>
);

PostHeader.propTypes = propTypes;

export default PostHeader;
