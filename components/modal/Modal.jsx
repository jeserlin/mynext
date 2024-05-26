/* eslint-disable react/require-default-props */
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import PostContent from 'components/postContent';

const PREFIX = 'Modal';

const classes = {
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  closeBtn: `${PREFIX}-closeBtn`,
};

const StyledDialog = styled(Dialog)((
  {
    theme,
  },
) => ({
  [`& .${classes.title}`]: {
    color: theme.palette.primary.dark,
  },

  [`& .${classes.content}`]: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
  },

  [`& .${classes.closeBtn}`]: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
}));

const propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  onClose: PropTypes.func,
};

const Modal = ({
  open = false, title = '', content = '', onClose = () => {},
}) => (
  <StyledDialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    scroll="paper"
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-description"
  >
    <DialogTitle
      classes={{
        root: classes.title,
      }}
    >
      {title}
      <IconButton
        aria-label="close"
        onClick={onClose}
        classes={{
          root: classes.closeBtn,
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <DialogContentText
        classes={{
          root: classes.content,
        }}
      >
        <PostContent content={content} />
      </DialogContentText>
    </DialogContent>
  </StyledDialog>
);

Modal.propTypes = propTypes;

export default Modal;
