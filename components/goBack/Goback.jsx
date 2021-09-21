import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

const propTypes = {
  path: PropTypes.string,
};

const defaultProps = {
  path: '/',
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(4),
  },
}));

const GoBack = ({ path }) => {
  const classes = useStyles();
  const router = useRouter();

  const onClickGoBack = (e) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <Box id="back-to-top-anchor" className={classes.root} onClick={onClickGoBack}>
      <ArrowBackIos fontSize="small" />
      <Typography>Back</Typography>
    </Box>
  );
};

GoBack.propTypes = propTypes;
GoBack.defaultProps = defaultProps;

export default GoBack;
