'use client'
import React, { useState } from 'react';
import { Editor } from '@tiptap/core';
import { Bold as BoldIcon, List, ListOrdered, Tag, Link as LinkIcon, Scissors as ScissorsIcon, Code as CodeIcon, Edit as EditIcon } from 'lucide-react';
import LinkModal from './linkmodal';

const EditorMenu = ({ editor, isHtmlMode, setIsHtmlMode }: { editor: Editor | null, isHtmlMode: boolean, setIsHtmlMode: (value: boolean) => void }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [initialUrl, setInitialUrl] = useState('');

  if (!editor) {
    return null;
  }

  const toggleStyledSpan = () => {
    editor.chain().focus().toggleMark('styledSpan').run();
  };

  const openLinkModal = () => {
    const currentUrl = editor.getAttributes('link').href || '';
    setInitialUrl(currentUrl);
    setIsLinkModalOpen(true);
  };

  const removeTripleSlash = () => {
    editor.chain().focus().command(({ tr }) => {
      const { doc } = tr;
      const changes: { from: number; to: number; text: string }[] = [];

      doc.descendants((node, pos) => {
        if (node.isText) {
          const text = node.text || '';
          const newText = text.replace(/\\{3}(.*?)\\{3}/g, '$1');
          if (newText !== text) {
            changes.push({ from: pos, to: pos + text.length, text: newText });
          }
        }
      });

      changes.reverse().forEach(change => {
        tr.insertText(change.text, change.from, change.to);
      });

      return true;
    }).run();
  };

  const removeTripleAngleBrackets = () => {
    editor.chain().focus().command(({ tr }) => {
      const { doc } = tr;
      const changes: { from: number; to: number; text: string }[] = [];

      doc.descendants((node, pos) => {
        if (node.isText) {
          const text = node.text || '';
          const newText = text.replace(/<<<(.*?)>>>/g, '$1');
          if (newText !== text) {
            changes.push({ from: pos, to: pos + text.length, text: newText });
          }
        }
      });

      changes.reverse().forEach(change => {
        tr.insertText(change.text, change.from, change.to);
      });

      return true;
    }).run();
  };

  const handleSaveLink = (url: string) => {
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <div className="menubar gap-2 flex justify-between my-2 p-2 bg-base-200 rounded-lg">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn btn-outline btn-sm tooltip tooltip-bottom ${editor.isActive('bold') ? 'btn-active' : ''}`}
          data-tip="Bold"
        >
          <BoldIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-outline btn-sm tooltip tooltip-bottom ${editor.isActive('bulletList') ? 'btn-active' : ''}`}
          data-tip="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-outline btn-sm tooltip tooltip-bottom ${editor.isActive('orderedList') ? 'btn-active' : ''}`}
          data-tip="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={toggleStyledSpan}
          className={`btn btn-outline btn-sm tooltip tooltip-bottom ${editor.isActive('styledSpan') ? 'btn-active' : ''}`}
          data-tip="Style Text"
        >
          <Tag size={16} />
        </button>
        <button
          onClick={openLinkModal}
          className={`btn btn-outline btn-sm tooltip tooltip-bottom ${editor.isActive('link') ? 'btn-active' : ''}`}
          data-tip="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <button 
          onClick={removeTripleSlash} 
          className="btn btn-outline btn-sm tooltip tooltip-bottom"
          data-tip="Remove \\\"
        >
          <ScissorsIcon size={16} /> \\\
        </button>
        <button 
          onClick={removeTripleAngleBrackets} 
          className="btn btn-outline btn-sm tooltip tooltip-bottom"
          data-tip="Remove <<< >>>"
        >
          <ScissorsIcon size={16} /> {`<<< >>>`}
        </button>
      </div>
      <button 
        onClick={() => setIsHtmlMode(!isHtmlMode)} 
        className="btn btn-outline btn-sm tooltip tooltip-bottom"
        data-tip={isHtmlMode ? "Switch to Edit Mode" : "Switch to HTML Mode"}
      >
        {isHtmlMode ? <EditIcon size={16} /> : <CodeIcon size={16} />}
        <span className="ml-2">{isHtmlMode ? 'Edit Mode' : 'HTML Mode'}</span>
      </button>

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
        initialUrl={initialUrl}
      />
    </div>
  );
};

export default EditorMenu;