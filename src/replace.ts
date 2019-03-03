import {Flat} from './types';
import {findRoot} from './findRoot';

export const replace = (into: Flat, at: number, what: Flat): Flat => {
  const mergeIdx = into.nodes.length;
  const merged: Flat = {
    nodes: into.nodes.map(node => ({...node})),
    contents: [...into.contents],
    definitions: {...into.definitions},
    footnotes: {...into.footnotes},
    footnoteOrder: [],
  };

  const replacedNode = merged.nodes[at];
  merged.nodes[at] = {
    type: 'portal',
    idx: at,
    parent: replacedNode.parent,
    original: replacedNode,
    children: [mergeIdx],
  } as any;

  // APPEND NODES.
  for (const node of what.nodes) {
    const newNode: any = {
      ...node,
      idx: node.idx + mergeIdx,
      parent: node.parent + mergeIdx,
    };

    if (newNode.children) {
      newNode.children = newNode.children.map((idx) => idx + mergeIdx);
    }
    merged.nodes.push(newNode);
  }
  merged.nodes[mergeIdx].parent = at;
  merged.nodes[mergeIdx].depth = (into.nodes[findRoot(into, at)].depth || 0) + 1;

  // MERGE METADATA.
  for (const idx of what.contents) {
    merged.contents.push(idx + mergeIdx);
  }
  Object.keys(what.definitions).forEach(
    (identifier) => (merged.definitions[identifier] = what.definitions[identifier] + mergeIdx),
  );

  // MERGE FOOTNOTES.
  Object.keys(what.footnotes).forEach(
    (identifier) => (merged.footnotes[identifier] = what.footnotes[identifier] + mergeIdx),
  );
  for (const node of merged.nodes)
    if (node.type === 'footnoteDefinition')
      (node as any).cnt = 0;
  let footnoteCounter = 0;
  for (const node of merged.nodes) {
    if ((node.type === 'footnoteReference') || (node.type === 'imageReference')) {
      const definition = merged.nodes[merged.footnotes[node.value as any]] as any;
      if (!definition.cnt) {
        definition.cnt = ++footnoteCounter;
        merged.footnoteOrder.push(definition.idx);
      }
    }
  }

  return merged;
};
