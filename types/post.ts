export interface PostRecord {
  slug?: string;
  title?: string;
  desc?: string;
  date?: string;
  type?: string;
  content?: string;
  coverImage?: string;
  ogImage?: string;
  author?: string;
  gallery?: string[];
  ingredient?: string[];
  labels?: string[];
}

export type PostField = keyof PostRecord;

export interface PostSummary {
  slug: string;
  title: string;
  coverImage?: string;
  desc?: string;
  date?: string;
}

export interface PostDetail extends Partial<PostSummary> {
  content?: string;
}
