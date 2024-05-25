/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import EditNoteIcon from '@mui/icons-material/EditNote';
import {
  Box, Chip, Grid, Stack, Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import SeoHeader from 'components/seoHeader';
import Modal from 'components/modal';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostsByFolder } from 'lib/api';

const All = 'All';

const propTypes = {
  years: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const useStyles = makeStyles((theme) => ({
  chip: {
    borderRadius: theme.shape.borderRadius,
  },
  postTitle: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1),
  },
  author: {
    ...theme.typography.body2,
    color: theme.palette.primary.dark,
  },
  imgContainer: {
    position: 'relative',
    width: 'fit-content',
  },
  img: {
    width: 'auto',
    maxHeight: '150px',
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  note: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.spacing(1),
  },
}));

const Books = ({ years = [], posts = [] }) => {
  const classes = useStyles();
  const [selectedYear, setSelectedYear] = useState(All);
  const [selectedBook, setSelectedBook] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickChip = (year) => {
    setSelectedYear(year);
  };

  const onSelectBook = async (book) => {
    const htmlContent = await markdownToHtml(book.content || '');
    if (!htmlContent) return;

    setSelectedBook({ ...book, content: htmlContent });
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPosts = () => {
    if (selectedYear === All) {
      return posts;
    }
    return _.filter(posts, ({ date }) => new Date(date).getFullYear() === selectedYear);
  };

  return (
    <>
      <SeoHeader
        title="Books"
        description="All about books"
      />
      <Stack direction="row" spacing={2} mb={6}>
        {years.map((year) => (
          <Chip
            key={year}
            classes={{
              root: classes.chip,
            }}
            variant={selectedYear === year ? 'filled' : 'outlined'}
            color="secondary"
            size="small"
            label={year}
            onClick={() => onClickChip(year)}
          />
        ))}
      </Stack>
      <Grid container alignItems="stretch" spacing={6}>
        {filteredPosts().map(({
          slug, coverImage, title, author, content,
        }) => (
          <Grid
            key={slug}
            item
            xs={6}
            md={4}
            lg={2}
            component={LazyLoad}
            once
            height="100%"
            throttle={60}
            offset={60}
          >
            <>
              <Box
                mb={2}
                className={classes.imgContainer}
                onClick={() => onSelectBook({ title, content })}
              >
                {coverImage && (
                  <LazyLoadImage
                    className={classes.img}
                    src={`${coverImage}?w=164&h=164&fit=crop&auto=format`}
                    height={150}
                    width={110}
                  />
                )}
                {content && <Box className={classes.note}><EditNoteIcon /></Box>}
              </Box>
              <Typography className={classes.postTitle}>{title}</Typography>
              <Typography className={classes.author}>{author}</Typography>
            </>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={isModalOpen}
        title={selectedBook.title}
        content={selectedBook.content}
        onClose={onCloseModal}
      />
    </>
  );
};

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'books',
    fields: ['slug', 'title', 'coverImage', 'author', 'date', 'content'],
  });

  const years = _.chain(posts)
    .reduce((acc, { date }) => {
      acc.push(new Date(date).getFullYear());
      return acc;
    }, [All])
    .uniq()
    .value();

  return {
    props: {
      years,
      posts,
    },
  };
}

Books.propTypes = propTypes;

export default Books;
