import {create} from 'md-mdast';
import {mdastToFlat} from '../mdastToFlat';
import * as fs from 'fs';

describe('structure', () => {
  it('exists', () => {
    expect(typeof mdastToFlat).toBe('function');
  });

  it('returns correct document shape', () => {
    const parser = create();
    const mdast = parser.tokenizeBlock('foo');
    const doc = mdastToFlat(mdast!);

    expect(mdast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'foo',
            },
          ],
        },
      ],
    });
    expect(doc).toMatchObject({
      nodes: [
        {
          type: 'root',
          children: [1],
        },
        {
          type: 'paragraph',
          children: [2],
        },
        {
          type: 'text',
          value: 'foo',
        },
      ],
      contents: [],
      definitions: {},
      footnotes: {},
      footnoteOrder: [],
    });
  });

  it('adds titles to contents list', () => {
    const parser = create();
    const mdast = parser.tokenizeBlock('# Title\n' + '\n' + '## Subtitle\n');
    const doc = mdastToFlat(mdast!);

    expect(mdast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Title',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Subtitle',
            },
          ],
        },
      ],
    });
    expect(doc).toMatchObject({
      nodes: [
        {
          type: 'root',
          children: [1, 3],
        },
        {
          type: 'heading',
          children: [2],
        },
        {
          type: 'text',
          value: 'Title',
        },
        {
          type: 'heading',
          children: [4],
        },
        {
          type: 'text',
          value: 'Subtitle',
        },
      ],
      contents: [1, 3],
      definitions: {},
      footnotes: {},
      footnoteOrder: [],
    });
  });

  it('structure link definitions', () => {
    const parser = create();
    const mdast = parser.tokenizeBlock('[Click me][click]\n' + '\n' + '[click]: https://github.com/');
    const doc = mdastToFlat(mdast!);

    expect(mdast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'linkReference',
              children: [
                {
                  type: 'text',
                  value: 'Click me',
                },
              ],
              identifier: 'click',
              referenceType: 'full',
            },
          ],
        },
        {
          type: 'definition',
          identifier: 'click',
          title: null,
          url: 'https://github.com/',
        },
      ],
    });
    expect(doc).toMatchObject({
      nodes: [
        {
          type: 'root',
          children: [1],
        },
        {
          type: 'paragraph',
          children: [2],
        },
        {
          type: 'linkReference',
          children: [3],
          identifier: 'click',
          referenceType: 'full',
        },
        {
          type: 'text',
          value: 'Click me',
        },
        {
          type: 'definition',
          identifier: 'click',
          title: null,
          url: 'https://github.com/',
        },
      ],
      contents: [],
      definitions: {
        click: 4,
      },
      footnotes: {},
      footnoteOrder: [],
    });
  });

  it('a footnote', () => {
    const parser = create();
    const mdast = parser.tokenizeBlock('Hello[^gg]\n' + '\n' + '[^gg]: world!');
    const doc = mdastToFlat(mdast!);

    expect(mdast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Hello',
            },
            {
              type: 'footnoteReference',
              value: 'gg',
            },
          ],
        },
        {
          type: 'footnoteDefinition',
          identifier: 'gg',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    });
    expect(doc).toMatchObject({
      nodes: [
        {
          type: 'root',
          children: [1],
        },
        {
          type: 'paragraph',
          children: [2, 3],
        },
        {
          type: 'text',
          value: 'Hello',
        },
        {
          type: 'footnoteReference',
        },
        {
          type: 'footnoteDefinition',
          cnt: 1,
          children: [5],
        },
        {
          type: 'paragraph',
          children: [6],
        },
        {
          type: 'text',
          value: 'world!',
        },
      ],
      contents: [],
      definitions: {},
      footnotes: {
        gg: 4,
      },
      footnoteOrder: [
        4,
      ],
    });
  });

  it('all elements twice or more', () => {
    const parser = create();
    const md = fs.readFileSync(__dirname + '/md/all-elements-twice.md', 'utf8');
    const mdast = parser.tokenizeBlock(md)!;
    const flat = mdastToFlat(mdast);

    expect(mdast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [{type: 'text', value: 'Title'}],
          depth: 1,
        },
        {
          type: 'definition',
          identifier: 'google',
          title: null,
          url: 'https://google.com',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'linkReference',
              children: [
                {
                  type: 'text',
                  value: 'Paragraph',
                },
              ],
              identifier: 'google',
              referenceType: 'full',
            },
            {type: 'text', value: ' foo'},
            {type: 'footnoteReference', value: 'footnote-1'},
            {type: 'text', value: ' bar.'},
          ],
        },
        {
          type: 'footnoteDefinition',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'This is footnote 1.',
                },
              ],
            },
          ],
          identifier: 'footnote-1',
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              value: 'Subtitle',
            },
          ],
          depth: 2,
        },
        {
          type: 'definition',
          identifier: 'bing',
          title: null,
          url: 'https://bing.com',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Another paragraph',
            },
            {
              type: 'footnoteReference',
              value: 'footnote-2',
            },
          ],
        },
        {
          type: 'footnoteDefinition',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'This is footnote 2.',
                },
              ],
            },
          ],
          identifier: 'footnote-2',
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              value: 'Sub-subtitle',
            },
          ],
          depth: 3,
        },
      ],
    });
    expect(flat).toMatchObject({
      nodes: [
        {type: 'root', children: [1, 4, 13, 16, 22]},
        {type: 'heading'},
        {type: 'text'},
        {type: 'definition'},
        {type: 'paragraph'},
        {type: 'linkReference'},
        {type: 'text'},
        {type: 'text'},
        {type: 'footnoteReference'},
        {type: 'text'},
        {type: 'footnoteDefinition', cnt: 1},
        {type: 'paragraph'},
        {type: 'text'},
        {type: 'heading'},
        {type: 'text'},
        {type: 'definition'},
        {type: 'paragraph'},
        {type: 'text'},
        {type: 'footnoteReference'},
        {type: 'footnoteDefinition', cnt: 2},
        {type: 'paragraph'},
        {type: 'text'},
        {type: 'heading'},
        {type: 'text'},
      ],
      contents: [1, 13, 22],
      definitions: {
        google: 3,
        bing: 15,
      },
      footnotes: {
        'footnote-1': 10,
        'footnote-2': 19,
      },
      footnoteOrder: [10, 19],
    });
  });
});
