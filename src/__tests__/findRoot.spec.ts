import {block} from 'very-small-parser/lib/markdown';
import {mdastToFlat} from '../mdastToFlat';
import {replace} from '../replace';
import {findRoot} from '../findRoot';
import * as fs from 'fs';

describe('findRoot', () => {
  it('find document root', () => {
    const md = fs.readFileSync(__dirname + '/md/all-elements-twice.md', 'utf8');
    const mdast = block.parsef(md)!;
    const flat = mdastToFlat(mdast);

    for (let idx = 0; idx < flat.nodes.length; idx++) {
      const res = findRoot(flat, idx);
      expect(res).toBe(0);
    }
  });

  it('finds first root in the merged document', () => {
    const mdast1 = block.parsef(`
1

merge
    `)!;
    const mdast2 = block.parsef(`
2
    `)!;
    const flat1 = mdastToFlat(mdast1);
    const flat2 = mdastToFlat(mdast2);
    const flat3 = replace(flat1, 3, flat2);

    for (let idx = 0; idx < flat1.nodes.length + 1; idx++) {
      const res = findRoot(flat3, idx);
      expect(res).toBe(0);
    }
    for (let idx = flat1.nodes.length + 1; idx < flat3.nodes.length; idx++) {
      const res = findRoot(flat3, idx);
      expect(res).toBe(flat1.nodes.length);
    }
  });

  it('finds first root in the doubly nested document', () => {
    const mdast1 = block.parsef(`
1

merge
    `)!;
    const mdast2 = block.parsef(`
2

merge
    `)!;
    const mdast3 = block.parsef(`
3
    `)!;
    const flat1 = mdastToFlat(mdast1);
    const flat2 = mdastToFlat(mdast2);
    const flat3 = mdastToFlat(mdast3);
    const flat4 = replace(flat1, 3, flat2);
    const flat5 = replace(flat4, 9, flat3);

    for (let idx = 0; idx < flat1.nodes.length + 1; idx++) {
      const res = findRoot(flat5, idx);
      expect(res).toBe(0);
    }
    for (let idx = flat1.nodes.length + 1; idx < flat4.nodes.length + 1; idx++) {
      const res = findRoot(flat5, idx);
      expect(res).toBe(flat1.nodes.length);
    }
    for (let idx = flat4.nodes.length + 1; idx < flat5.nodes.length; idx++) {
      const res = findRoot(flat5, idx);
      expect(res).toBe(flat4.nodes.length);
    }
  });
});
