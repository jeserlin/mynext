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
