/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const propTypes = {
  content: PropTypes.string,
};

const defaultProps = {
  content: {},
};

const useStyles = makeStyles((theme) => ({
  markdown: {
    '& > h3': {
      ...theme.typography.h3,
      color: theme.palette.primary.dark,
    },
    '& > h4': {
      ...theme.typography.h4,
      color: theme.palette.secondary.dark,
    },
    '& > ul,li,ol': {
      ...theme.typography.body1,
      color: theme.palette.text.secondary,
      paddingBottom: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingBottom: theme.spacing(1.5),
      },
    },
  },
}));

const PostContent = ({ content }) => {
  const classes = useStyles();

  return (
    <div
      className={classes.markdown}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

PostContent.propTypes = propTypes;
PostContent.defaultProps = defaultProps;

export default PostContent;
