/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { getPostsByFolder } from 'lib/api';
import {
  Box, Grid, Typography, makeStyles, fade,
} from '@material-ui/core';

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
  },
  postInfo: {
    width: '75%',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.main, 0.1),
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
      <Grid container alignItems="stretch" spacing={5}>
        {posts.map(({
          slug, title, coverImage, excerpt, date,
        }) => (

          <Grid
            key={slug}
            item
            xs={12}
            md={6}
          >
            <Link href={`/tech/${slug}`}>
              <a>
                <Box display="flex" className={classes.post}>
                  <Box className={classes.coverImg}>
                    {coverImage
                      ? (
                        <Image
                          src={coverImage}
                          layout="responsive"
                          width="100"
                          height="100"
                        />
                      )
                      : ''}
                  </Box>
                  <Box className={classes.postInfo}>
                    <Typography className={classes.postTitle}>{title}</Typography>
                    <Typography className={classes.postDesc}>{excerpt}</Typography>
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
    fields: ['slug', 'title', 'coverImage', 'excerpt', 'date'],
  });

  return {
    props: {
      posts,
    },
  };
}

Tech.propTypes = propTypes;
Tech.defaultProps = defaultProps;

export default Tech;
