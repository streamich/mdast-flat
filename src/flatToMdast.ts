import {FlatToMdast, Flat} from './types';
import {IRoot, TAnyToken, TBlockToken} from 'md-mdast/lib/types';

export const flatToMdast: FlatToMdast = (flat: Flat) => {
  const traverse: (index: number) => IRoot | TAnyToken = (index) => {
    const {idx: omit, ...node} = flat.nodes[index] as any;
    if (node.children) node.children = node.children.map(traverse);
    return node;
  };

  const mdast = traverse(0) as IRoot;
  if (!mdast.children) mdast.children = [];

  if (flat.definitions instanceof Object) {
    Object.values(flat.definitions).forEach((index) => {
      mdast.children.push(traverse(index) as TBlockToken);
    });
  }
  if (flat.footnotes instanceof Object) {
    Object.values(flat.footnotes).forEach((index) => {
      mdast.children.push(traverse(index) as TBlockToken);
    });
  }

  return mdast;
};
