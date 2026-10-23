export interface PostHeaderProps {
  title?: string;
}

const PostHeader = ({ title = '' }: PostHeaderProps) => (
  <div className="mb-4">
    <h1 className="text-gray-darker">
      {title}
    </h1>
  </div>
);

export default PostHeader;
