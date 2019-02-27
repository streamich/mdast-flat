import {Flat} from './types';

export const replace = (into: Flat, at: number, what: Flat): Flat => {
  const mergeIdx = into.nodes.length;
  const merged: Flat = {
    nodes: [...into.nodes],
    contents: [...into.contents],
    definitions: {...into.definitions},
    footnotes: {...into.footnotes},
    footnoteOrder: [...into.footnoteOrder],
  };

  const replacedNode = merged.nodes[at];
  merged.nodes[at] = {
    type: 'portal',
    idx: at,
    original: replacedNode,
    children: [mergeIdx],
  } as any;

  // APPEND NODES.
  for (const node of what.nodes) {
    const newNode: any = {
      ...node,
      idx: node.idx + mergeIdx,
    };

    if (newNode.children) {
      newNode.children = newNode.children.map((idx) => idx + mergeIdx);
    }
    merged.nodes.push(newNode);
  }

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
  let footnoteCount = into.footnoteOrder.length;
  for (const footnoteIndex of what.footnoteOrder) {
    const index = footnoteIndex + mergeIdx
    footnoteCount++;
    merged.footnoteOrder.push(index);
    (merged.nodes[index] as any).cnt = footnoteCount;
  }

  return merged;
};
