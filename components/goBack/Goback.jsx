/* eslint-disable react/require-default-props */
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography } from '@mui/material';

const PREFIX = 'GoBack';

const classes = {
  root: `${PREFIX}-root`,
};

const StyledBox = styled(Box)((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(4),
  },
}));

const propTypes = {
  path: PropTypes.string,
};

const GoBack = ({ path = '/' }) => {
  const router = useRouter();

  const onClickGoBack = (e) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <StyledBox id="back-to-top-anchor" className={classes.root} onClick={onClickGoBack}>
      <ArrowBackIcon fontSize="small" />
      <Typography ml={2}>Back</Typography>
    </StyledBox>
  );
};

GoBack.propTypes = propTypes;

export default GoBack;
