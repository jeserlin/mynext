import { X } from 'lucide-react';

import PostContent from 'components/postContent';

export interface ModalProps {
  open?: boolean;
  title?: string;
  content?: string;
  onClose?: () => void;
}

const Modal = ({
  open = false,
  title = '',
  content = '',
  onClose = () => {},
}: ModalProps) => (
  <dialog className={`modal ${open ? 'modal-open' : ''}`}>
    <div className="modal-box max-w-xl max-h-[80vh] bg-white p-0 rounded-[4px] [&_hr]:border-[#e5e7eb]">
      <div className="flex items-center justify-between px-4">
        <h3 className="font-bold text-lg text-secondary leading-none">{title}</h3>
        <button
          type="button"
          aria-label="close"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost"
        >
          <X size={20} />
        </button>
      </div>
      <hr />
      <div className="text-sm text-primary px-6 py-4 overflow-y-auto max-h-[calc(80vh-60px)]">
        <PostContent content={content} />
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button type="button" onClick={onClose}>close</button>
    </form>
  </dialog>
);

export default Modal;
