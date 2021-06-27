import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import MenuIcon from '@material-ui/icons/Menu';
import {
  AppBar, Toolbar, IconButton, makeStyles,
} from '@material-ui/core';

const propTypes = {
  onClickMenuIcon: PropTypes.func,
};

const defaultProps = {
  onClickMenuIcon: () => { },
};

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const Header = ({ onClickMenuIcon }) => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          className={classes.menuIcon}
          onClick={onClickMenuIcon}
        >
          <MenuIcon />
        </IconButton>
        <Image
          src="/yuan.png"
          width={30}
          height={26}
        />
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
