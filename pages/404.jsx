import React from 'react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

const PREFIX = 'NotFound';

const classes = {
  container: `${PREFIX}-container`,
  title: `${PREFIX}-title`,
};

const StyledBox = styled(Box)((
  {
    theme,
  },
) => ({
  [`&.${classes.container}`]: {
    height: '100%',
  },

  [`& .${classes.title}`]: {
    color: theme.palette.primary.dark,
    margin: theme.spacing(4, 0, 2, 0),
  },
}));

const NotFound = () => (
  <StyledBox
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
      style={{
        maxWidth: 200,
        height: 200,
      }}
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
  </StyledBox>
);

export default NotFound;
