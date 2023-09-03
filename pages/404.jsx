import React from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
  },
  title: {
    color: theme.palette.primary.dark,
    margin: theme.spacing(4, 0, 2, 0),
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.container}
    >
      <Image
        src="/assets/others/myBunnies.png"
        width={200}
        height={200}
      />
      <Typography
        variant="h6"
        className={classes.title}
      >
        Oops, page not found
      </Typography>
      <Typography color="textSecondary">
        But we have some cute bunnies for you, enjoy ~ !
      </Typography>
    </Box>
  );
};

export default NotFound;
