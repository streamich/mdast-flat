import {flatToMdast} from '../flatToMdast';

describe('structure', () => {
  it('exists', () => {
    expect(typeof flatToMdast).toBe('function');
  });

  it('single root', () => {
    const flat = {
      nodes: [
        {
          type: 'root',
        },
      ],
    };
    const mdast = flatToMdast(flat as any);

    expect(mdast).toEqual({
      type: 'root',
      children: [],
    });
  });

  it('doc 1', () => {
    const flat = {
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
    };
    const mdast = flatToMdast(flat as any);

    expect(mdast).toEqual({
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
  });

  it('doc 2', () => {
    const flat = {
      nodes: [
        {
          type: 'root',
          children: [1, 3],
        },
        {
          type: 'heading',
          children: [2],
          depth: 1,
        },
        {
          type: 'text',
          value: 'Title',
        },
        {
          type: 'heading',
          children: [4],
          depth: 2,
        },
        {
          type: 'text',
          value: 'Subtitle',
        },
      ],
      contents: [1, 3],
      definitions: {},
      footnotes: {},
    };
    const mdast = flatToMdast(flat as any);

    expect(mdast).toEqual({
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
  });

  it('doc 3', () => {
    const flat = {
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
    };
    const mdast = flatToMdast(flat as any);

    expect(mdast).toEqual({
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
  });

  it('doc 4', () => {
    const flat = {
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
          value: 'gg',
        },
        {
          type: 'footnoteDefinition',
          children: [5],
          identifier: 'gg',
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
    };
    const mdast = flatToMdast(flat as any);

    expect(mdast).toEqual({
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
                  value: 'world!',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
