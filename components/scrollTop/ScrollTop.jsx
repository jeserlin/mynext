import React from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Fab, Zoom, useScrollTrigger,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const propTypes = {
  window: PropTypes.shape({}),
};

const defaultProps = {
  window: undefined,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'none',
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  icon: {
    color: theme.palette.common.white,
  },
}));

const ScrollTop = ({ window }) => {
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        <Fab
          color="secondary"
          size="small"
          className={classes.icon}
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
};

ScrollTop.propTypes = propTypes;
ScrollTop.defaultProps = defaultProps;

export default ScrollTop;
