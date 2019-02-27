import {create} from 'md-mdast';
import {mdastToFlat} from '../mdastToFlat';
import {replace} from '../replace';

describe('structure', () => {
  it('exists', () => {
    expect(typeof replace).toBe('function');
  });

  it('simple example', () => {
    const parser = create();
    const mdast1 = parser.tokenizeBlock('1\n' + '\n' + 'replace me\n');
    const mdast2 = parser.tokenizeBlock('2\n');
    const flat1 = mdastToFlat(mdast1!);
    const flat2 = mdastToFlat(mdast2!);
    const merged = replace(flat1, 3, flat2);

    expect(merged).toMatchObject({
      nodes: [
        {type: 'root', children: [1, 3], idx: 0},
        {type: 'paragraph', children: [2], idx: 1},
        {type: 'text', value: '1', idx: 2},
        {type: 'portal', idx: 3, original: {type: 'paragraph', children: [4], idx: 3}, children: [5]},
        {type: 'text', value: 'replace me', idx: 4},
        {type: 'root', children: [6], idx: 5},
        {type: 'paragraph', children: [7], idx: 6},
        {type: 'text', value: '2', idx: 7},
      ],
      contents: [],
      definitions: {},
      footnotes: {},
      footnoteOrder: [],
    });
  });

  it('merges nodes', () => {
    const parser = create();
    const mdast1 = parser.tokenizeBlock('1\n' + '\n' + 'here\n' + '\n' + '4\n');
    const mdast2 = parser.tokenizeBlock('3\n' + '\n' + '4\n');
    const flat1 = mdastToFlat(mdast1!);
    const flat2 = mdastToFlat(mdast2!);
    const merged = replace(flat1, 3, flat2);

    expect(merged).toMatchObject({
      nodes: [
        {type: 'root', children: [1, 3, 5], idx: 0},
        {type: 'paragraph', children: [2], idx: 1},
        {type: 'text', value: '1', idx: 2},
        {type: 'portal', original: {type: 'paragraph', children: [4], idx: 3}, children: [7]},
        {type: 'text', value: 'here', idx: 4},
        {type: 'paragraph', children: [6], idx: 5},
        {type: 'text', value: '4', idx: 6},
        {type: 'root', children: [8, 10], idx: 7},
        {type: 'paragraph', children: [9], idx: 8},
        {type: 'text', value: '3', idx: 9},
        {type: 'paragraph', children: [11], idx: 10},
        {type: 'text', value: '4', idx: 11},
      ],
      contents: [],
      definitions: {},
      footnotes: {},
      footnoteOrder: [],
    });
  });

  it('merges metadata', () => {
    const parser = create();
    const mdast1 = parser.tokenizeBlock(`
# Click [here][link1] world![^foot]

merge here

[^foot]: This is footnote 1
[link1]: http://google.com
`);
    const mdast2 = parser.tokenizeBlock(`
## [what][gg]?[^note]

[gg]: mailto:gg@bets.com
[^note]: is dis...
`);
    const flat1 = mdastToFlat(mdast1!);
    const flat2 = mdastToFlat(mdast2!);
    const merged = replace(flat1, 7, flat2);

    expect(merged).toMatchObject({
      nodes: [
        {type: 'root', children: [1, 7], idx: 0},
        {
          type: 'heading',
          children: [2, 3, 5, 6],
          depth: 1,
          idx: 1,
        },
        {type: 'text', value: 'Click ', idx: 2},
        {
          type: 'linkReference',
          children: [4],
          identifier: 'link1',
          referenceType: 'full',
          idx: 3,
        },
        {type: 'text', value: 'here', idx: 4},
        {type: 'text', value: ' world', idx: 5},
        {
          type: 'imageReference',
          identifier: '^foot',
          referenceType: 'shortcut',
          alt: '^foot',
          idx: 6,
        },
        {
          type: 'portal',
          idx: 7,
          original: {type: 'paragraph', children: [8], idx: 7},
          children: [13],
        },
        {type: 'text', value: 'merge here', idx: 8},
        {
          type: 'footnoteDefinition',
          children: [10],
          identifier: 'foot',
          idx: 9,
        },
        {type: 'paragraph', children: [11], idx: 10},
        {type: 'text', value: 'This is footnote 1', idx: 11},
        {
          type: 'definition',
          identifier: 'link1',
          title: null,
          url: 'http://google.com',
          idx: 12,
        },
        {type: 'root', children: [14], idx: 13},
        {type: 'heading', children: [15, 17, 18], depth: 2, idx: 14},
        {
          type: 'linkReference',
          children: [16],
          identifier: 'gg',
          referenceType: 'full',
          idx: 15,
        },
        {type: 'text', value: 'what', idx: 16},
        {type: 'text', value: '?', idx: 17},
        {type: 'footnoteReference', value: 'note', idx: 18},
        {
          type: 'definition',
          identifier: 'gg',
          title: null,
          url: 'mailto:gg@bets.com',
          idx: 19,
        },
        {type: 'footnoteDefinition', children: [21], identifier: 'note', idx: 20},
        {type: 'paragraph', children: [22], idx: 21},
        {type: 'text', value: 'is dis…', idx: 22},
      ],
      contents: [1, 14],
      definitions: {link1: 12, gg: 19},
      footnotes: {foot: 9, note: 20},
      footnoteOrder: [9, 20],
    });
  });
});
