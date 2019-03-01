import {MdastToFlat, TNode, FlatDefinitions, FlatFootnotes} from './types';
import {IRoot, TAnyToken, IImageReference, IFootnoteReference} from 'md-mdast/lib/types';

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

  const traverse = (token: IRoot | TAnyToken): number => {
    const idx = nodes.length;
    const node = {...token, idx} as TNode;
    nodes.push(node);

    if (token.children) {
      if (token.children instanceof Array) {
        node.children = (token.children as any).map(traverse).filter((i: number) => i > -1);
      } else {
        const childIndex = traverse(token.children);
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
    traverse(mdast);

    let footnoteCounter = 0;
    for (const node of nodes) {
      if ((node.type === 'footnoteReference') || (node.type === 'imageReference')) {
        const identifier = ((node as IImageReference).identifier || (node as IFootnoteReference).value);
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
  }

  return doc;
};
