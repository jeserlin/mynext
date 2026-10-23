import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    document.querySelector('#back-to-top-anchor')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
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

export default ScrollTop;
