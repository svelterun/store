import {
  writable as _internal, 
  get as _get_store,
  Writable
} from 'svelte/store';

type Updater<T> = (value: T) => T;
/* eslint-disable @typescript-eslint/no-explicit-any */
type StoreDict<T = any> = { [key: string]: Writable<T> };
const stores: StoreDict = {};
const browser: boolean  = (typeof(window) != undefined);
const storage: any = localStorage || (browser ? (window.localStorage || new Map()) : new Map());

function writable<T>(key: string, initialValue: T): Writable<T> {

  function _update_store (key: string, value: T): void {
    storage[key] = JSON.stringify(value)
  }

  if (!stores[key]) {
    const store = _internal(initialValue, (set) => {
      const json = storage.has(key) ? storage[key] : null;
      if (json) set(<T> JSON.parse(json));

      if (browser) {
        const handleStorage = (event: StorageEvent) => {
          if (event.key === key) set(event.newValue ? JSON.parse(event.newValue) : null)
        }

        window.addEventListener("storage", handleStorage)
        return () => window.removeEventListener("storage", handleStorage)
      }
    });

    stores[key] = {
      set: (value: T) => {
        _update_store(key, value)
        store.set(value)
      },
      update: (updater: Updater<T>) => {
        const value = updater(_get_store(store))
        _update_store(key, value)
        store.set(value)
      },
      subscribe: store.subscribe
    }
  }

  return stores[key]
}

export {
  writable,
  stores,
  browser,
  storage,
}
export type {
  Writable,
  Updater,
  StoreDict,
}
