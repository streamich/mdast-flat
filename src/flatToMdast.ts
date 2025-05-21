import type {FlatToMdast, Flat} from './types';
import type {TInlineToken} from 'very-small-parser/lib/markdown/inline/types';
import type {IRoot, TBlockToken} from 'very-small-parser/lib/markdown';

export const flatToMdast: FlatToMdast = (flat: Flat) => {
  const traverse: (index: number) => IRoot | TBlockToken | TInlineToken = (index) => {
    const {idx: omit, ...node} = flat.nodes[index] as any;
    if (node.children) node.children = node.children.map(traverse);
    return node;
  };

  const mdast = traverse(0) as IRoot;
  if (!mdast.children) mdast.children = [];

  if (flat.definitions instanceof Object) {
    for (const index of Object.values(flat.definitions)) {
      mdast.children.push(traverse(index) as TBlockToken);
    }
  }
  if (flat.footnoteOrder instanceof Array) {
    for (const index of flat.footnoteOrder) {
      mdast.children.push(traverse(index) as TBlockToken);
    }
  }

  return mdast;
};
