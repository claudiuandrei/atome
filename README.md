# Atome

## Functional atoms and cursors

Atome is a functional set of helpers for creating and manipulating atoms and cursor written in TypeScript. It runs in the browser, or on the server using node.js.

### Setup

```bash
yarn add atome
```

or

```bash
npm install --save atome
```

### Usage

Before you start import the library

```javascript
import { create, cursor, deref, reset, watch } from 'atome'
```

#### Basic usage

```javascript
// Setup a new atom
const atom = create({ topic: { base: true } })
const pointer = cursor(atom, ['topic'])

// Update the data
const context = { test: true }

// Setup a watcher
const unwatch = watch(atom, () => {
  console.log(deref(atom), deref(pointer)) // { topic: { test: true } } { test: true }
})

// Reset the cursor data
reset(pointer, context)

// Cleanup
unwatch()
```

## License

[MIT](LICENSE)
