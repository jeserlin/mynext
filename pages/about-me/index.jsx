import React from 'react';
import SeoHeader from 'components/seoHeader';
import {
  Avatar, Box, Divider, Link, Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { EmailOutlined, GitHub, RoomOutlined } from '@mui/icons-material';

import { email, githubLink } from 'constants/basicInfo';

const useStyles = makeStyles((theme) => ({
  avatar: {
    ...theme.typography.h3,
    width: 100,
    height: 100,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.dark,
  },
  job: {
    color: theme.palette.primary.dark,
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
  list: {
    ...theme.typography.body2,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

const AboutMe = () => {
  const classes = useStyles();

  return (
    <>
      <SeoHeader
        title="About me"
        description="All about Jeserlin"
      />
      <Box display={{ xs: 'block', md: 'flex' }}>
        <Box mr={15} mb={4}>
          <Avatar
            variant="rounded"
            className={classes.avatar}
          >
            J
          </Avatar>
        </Box>
        <Box width={{ xs: '100%', md: '40%' }}>
          <Typography
            variant="h6"
            color="textSecondary"
          >
            Jeserlin Chiu
          </Typography>
          <Typography className={classes.job}>
            Front-end developer
          </Typography>
          <Divider light className={classes.divider} />
          <Box className={classes.list}>
            <RoomOutlined />
            Taiwan,taipei
          </Box>
          <Box className={classes.list}>
            <EmailOutlined />
            <Link
              href={`mailto:${email}`}
              underline="none"
              color="textSecondary"
            >
              {email}
            </Link>
          </Box>
          <Box className={classes.list}>
            <GitHub />
            <Link
              href={githubLink}
              underline="none"
              color="textSecondary"
              target="_blank"
            >
              {githubLink}
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AboutMe;
