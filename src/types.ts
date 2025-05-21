import type {TInlineToken} from 'very-small-parser/lib/markdown/inline/types';
import type {IRoot, TBlockToken} from 'very-small-parser/lib/markdown';

export interface FlatDefinitions {
  [id: string]: number;
}

export interface FlatFootnotes {
  [id: string]: number;
}

export type TNode = (IRoot | TBlockToken | TInlineToken) & {
  idx: number;
  parent: number;
  /**
   * Root nodes have `depth` key, which tracks how deeply they have been merged.
   */
  depth?: number;
  children?: number[];
};

export interface Flat {
  /**
   * Array holding all MDAST-Flat nodes.
   */
  nodes: TNode[];
  /**
   * List of `heading` node indices.
   */
  contents: number[];
  /**
   * Map of definition identifier to node index.
   */
  definitions: FlatDefinitions;
  /**
   * Map of footnote identifier to node index.
   */
  footnotes: FlatFootnotes;
  /**
   * Ordered list of footnote node indices.
   */
  footnoteOrder: number[];
}

export type MdastToFlat = (mdast: IRoot | TBlockToken | TInlineToken) => Flat;
export type FlatToMdast = (flat: Flat) => IRoot | TBlockToken | TInlineToken;
