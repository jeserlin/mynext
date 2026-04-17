import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowUp } from 'lucide-react';

const propTypes = {
  window: PropTypes.shape({}),
};

const ScrollTop = ({ window: windowProp }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const target = windowProp ? windowProp() : window;
      if (target.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const target = windowProp ? windowProp() : window;
    target.addEventListener('scroll', handleScroll);

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [windowProp]);

  const handleClick = () => {
    const anchor = document.querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex fixed bottom-4 right-4 btn btn-secondary btn-sm btn-circle transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="scroll back to top"
    >
      <ArrowUp size={20} className="text-white" />
    </button>
  );
};

ScrollTop.propTypes = propTypes;

export default ScrollTop;
