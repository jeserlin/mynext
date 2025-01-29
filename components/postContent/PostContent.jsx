/* eslint-disable react/require-default-props */
/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  content: PropTypes.string,
};

const PostContent = ({ content = {} }) => (
  <div
    className="content-container"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

PostContent.propTypes = propTypes;

export default PostContent;
