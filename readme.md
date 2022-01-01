<div align=center>
  <h1><code>@svelterun/store</code></h1>
  <p>Persisted version of Svelte's <code>writable</code> store.</p>
</div>

## Installation

```bash
pnpm add @svelterun/store
```

```bash
yarn add @svelterun/store
```

```bash
npm i -D @svelterun/store
```

## Usage

### `./stores.js`

```javascript
import { writable } from '@svelterun/store'

/**
 * @param {string} key - localStorage key 
 * @param {*} value - the store's initial value
 * @returns {import('svelte/store').Writable}
 */
export const preferences = writable('preferences', {
  theme: 'dark',
  pane: '50%',
  // ...
})
```

### `./App.svelte`

```javascript
import { get } from 'svelte/store'
import { preferences } from './stores'

// subscribe to changes
preferences.subscribe(value => console.log('preferences:\n', value))

// update value
preferences.update(current => ({...current, theme: 'light'}))

// set value
preferences.set(value)

// read value
get(preferences)

// read value with auto subscription
$preferences
```

## License

MIT © [Svelte.run](https://github.com/svelterun), [Nicholas Berlette](https://github.com/nberlette)
