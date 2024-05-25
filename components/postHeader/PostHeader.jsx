import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const propTypes = {
  // eslint-disable-next-line react/require-default-props
  title: PropTypes.string,
};

const PostHeader = ({ title = '' }) => (
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

export default PostHeader;
