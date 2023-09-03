/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import LazyLoad from 'react-lazyload';
import { getPostsByFolder } from 'lib/api';
import { Box, Grid, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import SeoHeader from 'components/seoHeader';
import { formatDate } from 'lib/convertors';

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const defaultProps = {
  posts: [],
};

const useStyles = makeStyles((theme) => ({
  post: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    width: '100%',
    transitionDuration: '.3s',
    '&:hover': {
      boxShadow: theme.shadows[1],
    },
  },
  coverImg: {
    width: '25%',
    '& > * > img': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  postInfo: {
    width: '75%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  postTitle: {
    ...theme.typography.subtitle1,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
  },
  postDesc: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  postDate: {
    ...theme.typography.caption,
    color: theme.palette.text.hint,
    textAlign: 'bottom',
  },
}));

const Tech = ({ posts }) => {
  const classes = useStyles();

  return (
    <>
      <SeoHeader
        title="Tech"
        description="All about tech"
      />
      <Grid container alignItems="stretch" spacing={6}>
        {posts.map(({
          slug, title, coverImage, desc, date,
        }) => (
          <Grid
            key={slug}
            item
            xs={12}
            md={6}
            component={LazyLoad}
            once
            height="100%"
            throttle={80}
            offset={80}
          >
            <Link href={`/tech/${slug}`}>
              <a>
                <Box display="flex" className={classes.post}>
                  <Box className={classes.coverImg}>
                    {coverImage && (
                      <Image
                        src={coverImage}
                        layout="responsive"
                        width="100"
                        height="100"
                      />
                    )}
                  </Box>
                  <Box className={classes.postInfo}>
                    <Typography className={classes.postTitle}>{title}</Typography>
                    <Typography className={classes.postDesc}>{desc}</Typography>
                    <Typography className={classes.postDate}>
                      {`更新時間: ${formatDate(date)}`}
                    </Typography>
                  </Box>
                </Box>
              </a>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'tech',
    fields: ['slug', 'title', 'coverImage', 'desc', 'date'],
  });

  const sortedPosts = _.sortBy(posts, ['date']).reverse();
  return {
    props: {
      posts: sortedPosts,
    },
  };
}

Tech.propTypes = propTypes;
Tech.defaultProps = defaultProps;

export default Tech;
