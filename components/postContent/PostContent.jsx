/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, fade } from '@material-ui/core';

const propTypes = {
  content: PropTypes.string,
};

const defaultProps = {
  content: {},
};

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body1,
    color: theme.palette.text.primary,
    '& > h3': {
      ...theme.typography.h3,
      color: theme.palette.primary.dark,
    },
    '& > h4': {
      ...theme.typography.h4,
      color: theme.palette.secondary.dark,
    },
    '& > h5': {
      ...theme.typography.h5,
      margin: theme.spacing(4, 0),
      color: theme.palette.secondary.dark,
    },
    '& > h6': {
      ...theme.typography.h6,
      margin: theme.spacing(4, 0),
      color: theme.palette.secondary.dark,
    },
    '& *:not(pre) > code': {
      padding: theme.spacing(0.5),
      backgroundColor: fade(theme.palette.primary.light, 0.5),
    },
    '& > ul': {
      paddingLeft: theme.spacing(5),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(10),
      },
      '& > li > ul': {
        paddingLeft: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
          paddingLeft: theme.spacing(10),
        },
      },
    },
    '& > ul,li,ol': {
      color: theme.palette.text.secondary,
      paddingBottom: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingBottom: theme.spacing(1.5),
      },
    },
    '& > img': {
      width: '100%',
    },
    '& > * > a': {
      color: theme.palette.info.main,
    },
    '& > hr': {
      height: 1,
      backgroundColor: theme.palette.primary.dark,
      border: 'none',
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
