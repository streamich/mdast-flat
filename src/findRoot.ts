import {Flat} from './types';

export const findRoot = (flat: Flat, idx: number): number => {
  const nodes = flat.nodes;
  while (true) {
    const token = nodes[idx];
    idx = token.parent;
    if (!idx) return 0;
    if (nodes[idx].type === 'root') return idx;
  }
};
