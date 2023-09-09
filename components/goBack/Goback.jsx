import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
      <ArrowBackIcon fontSize="small" />
      <Typography ml={2}>Back</Typography>
    </Box>
  );
};

GoBack.propTypes = propTypes;
GoBack.defaultProps = defaultProps;

export default GoBack;
