import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: '',
};

const PostHeader = ({ title }) => (
  <Box mb={4}>
    <Typography
      variant="h1"
      color="textSecondary"
    >
      {title}
    </Typography>
  </Box>
);

PostHeader.propTypes = propTypes;
PostHeader.defaultProps = defaultProps;

export default PostHeader;
