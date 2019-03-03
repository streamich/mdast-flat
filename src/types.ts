import {IRoot, TAnyToken} from 'md-mdast/lib/types';

export interface FlatDefinitions {
  [id: string]: number;
}

export interface FlatFootnotes {
  [id: string]: number;
}

export type TNode = (IRoot | TAnyToken) & {
  idx: number;
  parent: number;
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

export type MdastToFlat = (mdast: IRoot | TAnyToken) => Flat;
export type FlatToMdast = (flat: Flat) => IRoot | TAnyToken;
