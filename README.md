# Carbo

## Super fast and simple immutable object helpers

Carbo is a super fast and simple set of helpers for immutable data. It runs in the browser, or on the server using node.js.

### Setup

```bash
yarn add carbo
```

or

```bash
npm install --save carbo
```

### Usage

Before you start import the library

```javascript
import { has, get, set, unset, update } from 'carbo'
```

#### Basic usage

```javascript
// We have an object
const obj = { name: 'John Doe', age: 25, work: { company: 'ACME', title: 'CEO' } }

// Has
has(obj, 'name') // true
has(obj, ['work', 'email']) // false

// Get
get(obj, 'name') // John Doe
get(obj, ['work', 'title']) // CEO

// Set
const obj1 = set(obj, 'name', 'Jane Doe') // { ...obj, name: 'Jane Doe' }
const obj2 = set(obj, ['work', 'title'], 'CTO') // { ...obj, work: { ...obj.work, title: CTO }}

// Unset
const obj3 = unset(obj, 'age') // { name: 'John Doe', work: obj.work }
const obj4 = unset(obj, ['work', 'title']) // { name: 'John Doe', age: 25, work: { company: 'ACME' } }

// Update
const obj5 = update(obj, 'age', n => n + 1) // { ...obj, age: 26 }
const obj6 = update(obj, ['work', 'title'], s => `Best ${s}`) // { ...obj, work: { ...obj.work, title: 'Best CEO' } }
```

## License

[MIT](LICENSE)
