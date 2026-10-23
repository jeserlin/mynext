import type { MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

export interface GoBackProps {
  path?: string;
}

const GoBack = ({ path = '/' }: GoBackProps) => {
  const router = useRouter();

  const onClickGoBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    void router.push(path);
  };

  return (
    <button
      id="back-to-top-anchor"
      type="button"
      className="flex items-center cursor-pointer text-primary-content mb-4"
      onClick={onClickGoBack}
    >
      <ArrowLeft size={20} />
      <span className="ml-2">Back</span>
    </button>
  );
};

export default GoBack;
