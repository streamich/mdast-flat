# mdast-flat

- Flat version of [MDAST format](https://github.com/syntax-tree/mdast).
- Nodes are stored in a flat `nodes` array instead of a nested tree.
- Table of contents is available in `contents` key.
- All definitions are available in `definitions` map.
- All footnotes are available in `footnotes` map.

Main difference from MDAST is that `Parent` node `children` property is an
array of numbers (instead of array of nodes). Numbers are indices to `node`
array, which contain all nodes.

```idl
interface FlatParent <: Parent {
  children: [number]
}
```

Full document schema:

```idl
type Node = Root | FlatParent | Literal

interface MdastFlat {
  nodes: [Node]
  contents: [Heading]
  definitions: {
    [identifier]: Definition
  }
  footnotes: {
    [identifier]: FootnoteDefinition
  }
}
```

## License

[Unlicense](LICENSE) &mdash; public domain.
