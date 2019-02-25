import {IRoot, TAnyToken} from 'md-mdast/lib/types';

export interface FlatDefinitions {
  [id: string]: number;
}

export interface FlatFootnotes {
  [id: string]: number;
}

export type TNode = (IRoot | TAnyToken) & {idx: number; children?: number[]};

export interface Flat {
  nodes: TNode[];
  contents: number[];
  definitions: FlatDefinitions;
  footnotes: FlatFootnotes;
}

export type MdastToFlat = (mdast: IRoot | TAnyToken) => Flat;
export type FlatToMdast = (flat: Flat) => IRoot | TAnyToken;
