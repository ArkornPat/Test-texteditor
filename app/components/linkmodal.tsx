import React, { useState, useEffect } from 'react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  initialUrl?: string;
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onSave, initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  const handleSave = () => {
    onSave(url);
    onClose();
  };

  const handleRemove = () => {
    onSave('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]'>
      <div className="flex justify-center items-center h-full">
        <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all">
          <h2 className="text-xl font-semibold mb-4">Edit Link</h2>
          <div className="form-control w-full">
          <label className="label">
            <span className="label-text">URL</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g., https://example.com)"
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleRemove}>
            Remove
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;