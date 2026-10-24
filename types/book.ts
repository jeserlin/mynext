import type { PostSummary } from 'types/post';

export interface BookPost extends PostSummary {
  author: string;
  content?: string;
  date: string;
}

export type BookNote = Pick<BookPost, 'title' | 'content'>;
