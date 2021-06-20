import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';

import markdownToHtml from '../../lib/markdownToHtml'
import { getPostBySlug, getAllPosts } from '../../lib/api'

const useStyles = makeStyles((theme) => ({
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
    <div
      className={classes.markdown}
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
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
