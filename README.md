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


## Usage

```js
import {mdastToFlat, flatToMdast} from 'mdast-flat';

const flat = mdastToFlat(mdast1);
const mdast2 = flatToMdast(flat);
```


## Reference

- `mdastToFlat(mdast)` &mdash; converts MDAST to MDAST-Flat.
- `flatToMdast(flat)` &mdash; converts MDAST-Flat to MDAST.


## Example

Let's say you have the following Markdown.

    [Click me][click]

    [click]: https://github.com/

You could convert it to MDAST using [`md-mdast`]()

```yml
type: root
children:
- type: paragraph
  children:
  - type: linkReference
    children:
    - type: text
      value: Click me
    identifier: click
    referenceType: full
- type: definition
  identifier: click
  title:
  url: https://github.com/
```

Using `mdastToFlat()` function you can covert it to MDAST-Flat.

```yml
nodes:
- type: root
  children:
  - 1
- type: paragraph
  children:
  - 2
- type: linkReference
  children:
  - 3
  identifier: click
  referenceType: full
- type: text
  value: Click me
- type: definition
  identifier: click
  title:
  url: https://github.com/
contents: []
definitions:
  click: 4
footnotes: {}
```


## License

[Unlicense](LICENSE) &mdash; public domain.
