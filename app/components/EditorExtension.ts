import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Link from '@tiptap/extension-link';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import { BoldMark, LinkMark, StyledSpan } from "./Marks";
import TextAlign from "@tiptap/extension-text-align";


const editorExtensions = [
    Document,
    Paragraph,
    Text,
    TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
    }),
    ListItem,
    BulletList,
    OrderedList,
    LinkMark,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            target: '_blank',
            rel: '',
        },
    }),
    Bold,
    StyledSpan,
    BoldMark,
    HardBreak.extend({
        addKeyboardShortcuts() {
            return {
                Enter: () => {
                    if (!this.editor.isActive('bulletList') && !this.editor.isActive('orderedList')) {
                        return this.editor.commands.setHardBreak();
                    }
                    return false;
                }
            };
        }
    }),
];

export { editorExtensions };