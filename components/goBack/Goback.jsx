import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

const propTypes = {
  path: PropTypes.string,
};

const GoBack = ({ path = '/' }) => {
  const router = useRouter();

  const onClickGoBack = (e) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <div
      id="back-to-top-anchor"
      className="flex items-center cursor-pointer text-primary-content mb-4"
      onClick={onClickGoBack}
      aria-hidden="true"
    >
      <ArrowLeft size={20} />
      <div className="ml-2">Back</div>
    </div>
  );
};

GoBack.propTypes = propTypes;

export default GoBack;
