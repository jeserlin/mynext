export interface PostContentProps {
  content?: string;
}

const PostContent = ({ content = '' }: PostContentProps) => (
  <div
    className="content-container"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

export default PostContent;
