# mdast-flat

- Flat version of [MDAST format](https://github.com/syntax-tree/mdast).
- Nodes are stored in a flat `nodes` array instead of a nested tree.
- Table of contents is available in `contents` key.
- All definitions are available in `definitions` map.
- All footnotes are available in `footnotes` map.

Main difference from MDAST is that `Parent` node `children` property is an
array of numbers (instead of array of nodes). Numbers are indices into `nodes`
array, which contain all nodes.

```idl
interface FlatParent <: Parent {
  children: [number]
}
```

Full document schema:

```idl
interface MdastFlat {
  nodes: [Root | FlatParent | Literal]
  contents: [number]
  definitions: {
    [identifier]: number
  }
  footnotes: {
    [identifier]: number
  }
}
```

- `node` &mdash; a flat array of document nodes.
- `contents` &mdash; an array of heading indices into `nodes` list.
- `definitions` &mdash; a map of definition identifiers into `nodes` list index numbers.
- `footnotes` &mdash; a map of footnote identifiers into `nodes` list index numbers.

## License

[Unlicense](LICENSE) &mdash; public domain.
