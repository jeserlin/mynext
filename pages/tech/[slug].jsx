/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import mermaid from 'mermaid';
import { useRouter } from 'next/router';
import {
  Box, Grid, Typography,
} from '@mui/material';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';
import { formatDate } from 'lib/convertors';

const PREFIX = 'TechPost';

const classes = {
  root: `${PREFIX}-root`,
  contentBox: `${PREFIX}-contentBox`,
  content: `${PREFIX}-content`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  [`& .${classes.root}`]: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 10),
    },
  },

  [`& .${classes.contentBox}`]: {
    width: '100%',
  },

  [`& .${classes.content}`]: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
}));

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string,
  }),
};

const techMainPath = '/tech';

const TechPost = (props) => {
  const { post = {} } = props;

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  useEffect(() => {
    mermaid.contentLoaded();
  });

  return (
    (
      <Root>
        <SeoHeader
          title={`${post.title}`}
          description={post.desc}
        />
        <GoBack path={techMainPath} />
        <Box className={classes.root}>
          <PostHeader title={post.title} />
          <Typography
            variant="caption"
            color="textSecondary"
            gutterBottom
          >
            {`更新時間: ${formatDate(post.date)}`}
          </Typography>
          <Box mb={10} />
          <Grid container className={classes.contentBox}>
            <Grid item xs={12} lg={10} xl={8} className={classes.content}>
              <PostContent content={post.content} />
            </Grid>
          </Grid>
        </Box>
        <ScrollTop {...props} />
      </Root>
    )
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('tech', params.slug, [
    'title',
    'desc',
    'date',
    'slug',
    'content',
  ]);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getPostsByFolder({
    folder: 'tech',
    fields: ['slug'],
  });

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

TechPost.propTypes = propTypes;

export default TechPost;
