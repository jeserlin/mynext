import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string,
};

const PostHeader = ({ title = '' }) => (
  <div className="mb-4">
    <h1 className="text-gray-darker">
      {title}
    </h1>
  </div>
);

PostHeader.propTypes = propTypes;

export default PostHeader;
