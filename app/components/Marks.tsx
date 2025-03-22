import { Mark, mergeAttributes, PasteRule } from '@tiptap/core';

const StyledSpan = Mark.create({
    name: 'styledSpan',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span.text-style-1',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes({ class: 'text-style-1' }, HTMLAttributes), 0];
    },

    addPasteRules() {
        return [
            new PasteRule({
                find: /\\{3}([\s\S]*?)\\{3}/g,
                handler: ({ match, range, commands }) => {
                    const [, content] = match;
                    commands.insertContentAt(range, `<span class="text-style-1">${content}</span>`);
                },
            }),
        ];
    },
});

const BoldMark = Mark.create({
    name: 'boldMark',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    parseHTML() {
        return [
            {
                tag: 'strong',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['strong', mergeAttributes(HTMLAttributes), 0];
    },

    addPasteRules() {
        return [
            new PasteRule({
                find: /\*{3}(.*?)\*{3}/g,
                handler: ({ match, range, commands }) => {
                    const [, content] = match;
                    commands.insertContentAt(range, `<strong>${content}</strong>`);
                },
            }),
        ];
    },
});

const LinkMark = Mark.create({
    name: 'linkMark',

    addOptions() {
        return {
            HTMLAttributes: {
                href: '/',
                target: '_blank',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'a[href]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addPasteRules() {
        return [
            new PasteRule({
                find: /<<<(.*?)>>>/g,
                handler: ({ match, range, commands }) => {
                    const [, content] = match;
                    commands.insertContentAt(range, `<a href="#" target="_blank">${content}</a>`);
                },
            }),
        ];
    },
});

export { StyledSpan, BoldMark, LinkMark };
