# mdast-flat

- Flat version of [MDAST format](https://github.com/syntax-tree/mdast).
- Nodes are stored in a flat `nodes` array instead of a nested tree.
- Table of contents is available in `contents` key.
- All definitions are available in `definitions` map.
- All footnotes are available in `footnotes` map.

Main difference from MDAST is that `Parent` node `children` property is an
array of numbers (instead of array of nodes). Numbers are indices into `nodes`
array, which contains all nodes.

```idl
interface FlatParent <: Parent {
  idx: number
  children: [number]
}
```

`idx` is index of the current node, `children` contains array of children indices.

Full document schema:

```idl
interface MdastFlat {
  nodes: [Root | FlatParent | Literal]
  contents: [number]
  definitions: {[identifier]: number}
  footnotes: {[identifier]: number}
  footnoteOrder: [number]
}
```

- `node` &mdash; a flat array of document nodes.
- `contents` &mdash; an array `nodes` indices, which are `heading` nodes.
- `definitions` &mdash; a map of definition identifiers into `nodes` indices.
- `footnotes` &mdash; a map of footnote identifiers into `nodes` indices.
- `footnoteOrder` &mdash; ordered list of footnote node indices.


### Nodes

MDAST-Flat nodes have the following attributes.

- All the same attributes as MDAST tokens, except see below.
- `children` attribute is an array of numbers that index into `nodes` list.
- `idx` a number, which is the index of current node in `nodes` list.
- `parent` a number, which is the index of parent node in the `nodes` list.
- Root nodes also have `depth` attribute which tracks
  its depth if another document was merged in using `replace` function.

## Usage

```js
import {mdastToFlat, flatToMdast} from 'mdast-flat';

const flat = mdastToFlat(mdast1);
const mdast2 = flatToMdast(flat);
```


## Reference

- `mdastToFlat(mdast)` &mdash; converts MDAST to MDAST-Flat.
- `flatToMdast(flat)` &mdash; converts MDAST-Flat to MDAST.
- `replace(flat1, idx, flat2)` &mdash; replaces node `idx` in `flat1` by `flat2`.


## Example

Let's say you have the following Markdown.

    [Click me][click]

    [click]: https://github.com/

You could convert it to MDAST using [`very-small-parser`](https://github.com/streamich/very-small-parser).

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
footnoteOrder: []
```

### Replacing node with document

You can use `replace()` function to insert a Markdown document inside another Markdown
document instead of some specified node.

Consider you have a Markdown document.

    1

    replace me

And another document.

    2

Let's say you have parsed both documents into `flat1` and `flat2` MDAST-Flat objects, respectively.
Now you want to insert the second document inside the first document in place of `replace me`
paragraph (which has `idx` of `3` in `flat1`);

```js
const merged = replace(flat1, 3, flat2);
```

The result is MDAST-Flat `merged` object, which merges all nodes using new `portal` node. It also
merges `contents`, `definitions` and `footnotes`, if there are any.

```yml
nodes:
- type: root
  children:
  - 1
  - 3
  idx: 0
- type: paragraph
  children:
  - 2
  idx: 1
- type: text
  value: '1'
  idx: 2
- type: portal
  idx: 3
  original:
    type: paragraph
    children:
    - 4
    idx: 3
  children:
  - 5
- type: text
  value: replace me
  idx: 4
- type: root
  children:
  - 6
  idx: 5
- type: paragraph
  children:
  - 7
  idx: 6
- type: text
  value: '2'
  idx: 7
contents: []
definitions: {}
footnotes: {}
footnoteOrder: []
```

Resulting Markdown equivalent is:

    1

    2


## License

[Unlicense](LICENSE) &mdash; public domain.
