import type {MdastToFlat, TNode, FlatDefinitions, FlatFootnotes} from './types';
import type {TInlineToken} from 'very-small-parser/lib/markdown/inline/types';
import type {IRoot, TBlockToken, IImageReference, IFootnoteReference} from 'very-small-parser/lib/markdown';

export const mdastToFlat: MdastToFlat = (mdast) => {
  const nodes: TNode[] = [];
  const contents: number[] = [];
  const definitions: FlatDefinitions = {};
  const footnotes: FlatFootnotes = {};
  const footnoteOrder: number[] = [];
  const doc = {
    nodes,
    contents,
    definitions,
    footnotes,
    footnoteOrder,
  };

  type MdastNode = IRoot | TBlockToken | TInlineToken;

  const traverse = (token: MdastNode, parent: number): number => {
    const idx = nodes.length;
    const node = {...token, idx, parent} as TNode;
    nodes.push(node);

    if (token.children) {
      if (token.children instanceof Array) {
        node.children = (token.children as MdastNode[])
          .map((token) => traverse(token, idx))
          .filter((i: number) => i > -1) as any;
      } else {
        const childIndex = traverse(token.children, idx);
        if (childIndex > -1) {
          node.children = [childIndex] as any;
        }
      }
    }

    switch (node.type) {
      case 'heading':
        contents.push(idx);
        return idx;
      case 'definition':
        definitions[node.identifier] = idx;
        return -1;
      case 'footnoteDefinition':
        footnotes[node.identifier] = idx;
        return -1;
      default:
        return idx;
    }
  };

  if (mdast) {
    traverse(mdast, 0);

    // Process references.
    let footnoteCounter = 0;
    for (const node of nodes) {
      if (node.type === 'footnoteReference' || node.type === 'imageReference') {
        const identifier = (node as IImageReference).identifier || (node as IFootnoteReference).value;
        if (identifier) {
          const footnoteIndex = footnotes[identifier];
          if (footnoteIndex !== undefined) {
            const definition = nodes[footnoteIndex] as any;
            if (!definition.cnt) {
              definition.cnt = ++footnoteCounter;
              footnoteOrder.push(definition.idx);
            }
          }
        }
      }
    }

    // Process root node.
    const root = doc.nodes[0];
    root.depth = 0;
  }

  return doc;
};
