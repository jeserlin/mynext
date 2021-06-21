import ErrorPage from 'next/error';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Grid, Typography, makeStyles } from '@material-ui/core';

import markdownToHtml from '../../lib/markdownToHtml'
import { getPostBySlug, getAllPosts } from '../../lib/api'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  content: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  image: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 2,
    },
    '& > * > img': {
      borderRadius: theme.spacing(4),
    }
  },
  markdown: {
    '& > h3': {
      ...theme.typography.h3,
      color: theme.palette.primary.dark,
    },
    '& > h4': {
      ...theme.typography.h4,
      color: theme.palette.secondary.dark,
    },
    '& > ul,li,ol': {
      ...theme.typography.body1,
      color: theme.palette.text.secondary,
      paddingBottom: theme.spacing(1),
    }
  },
}));

const BakingPost = ({ post, morePosts, preview }) => {
  const classes = useStyles();

  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Typography
        variant='h1'
        color='textSecondary'
        className={classes.title}
      >
        {post.title}
      </Typography>
      <Grid container className={classes.root}>
        <Grid item xs={12} md={8} className={classes.content}>
          <div
            className={classes.markdown}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Grid>
        <Grid item xs={12} md={4} className={classes.image}>
          {post.coverImage
            ? (
              <Image
                src={post.coverImage}
                layout="responsive"
                width='100'
                height='100'
              />
            )
            : ''
          }
        </Grid>
      </Grid>
    </>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

export default BakingPost;
