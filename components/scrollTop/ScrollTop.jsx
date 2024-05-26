import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Fab, Zoom, useScrollTrigger,
} from '@mui/material';

const PREFIX = 'ScrollTop';

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
};

const StyledZoom = styled(Zoom)((
  {
    theme,
  },
) => ({
  [`& .${classes.root}`]: {
    display: 'none',
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  [`& .${classes.icon}`]: {
    color: theme.palette.common.white,
  },
}));

const propTypes = {
  window: PropTypes.shape({}),
};

const ScrollTop = ({ window }) => {
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
    <StyledZoom in={trigger}>
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
    </StyledZoom>
  );
};

ScrollTop.propTypes = propTypes;

export default ScrollTop;
