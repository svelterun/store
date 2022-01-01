import {
  writable as internal, 
  get,
  Writable
} from 'svelte/store';
export declare type Updater<T> = (value: T) => T;
export declare type StoreDict<T> = { [key: string]: Writable<T> }

/* eslint-disable @typescript-eslint/no-explicit-any */
export const stores: StoreDict<any> = {}

export declare class Store {
  stores: StoreDict<any>;
  readonly browser: boolean = (typeof(window) !== undefined);
  
  constructor () {
    super();
    this.stores = browser ? window.localStorage : new Map();
  }
  
  update (key: string, value: any): void {
    this.stores[key] = JSON.stringify(value);
    return this;
  }

  writable<T> (key: string, initialValue: T): Writable<T> {
    if (!this.stores[key]) {
      const store = internal(initialValue, set => {
        const json = this.stores[key] || null;
	if (json) set(<T> JSON.parse(json));
	if (this.browser) {
          const handleStorage = (event: StorageEvent) => {
            if (event.key === key)
              set(event.newValue ? JSON.parse(event.newValue) : null)
          }

          window.addEventListener("storage", handleStorage)
          return () => window.removeEventListener("storage", handleStorage)
	}
      })

      this.stores[key] = {
        set: (value: T) => {
          this.update(key, value)
          store.set(value)
        },
        update: (updater: Updater<T>) => {
          const value = updater(get(store))
          this.update(key, value)
          store.set(value)
        },
        subscribe: () => store.subscribe(...arguments)
      }
    }
    return this.stores[key]
  }

}

export function writable<T>(key: string, initialValue: T): Writable<T> {
  const browser = (typeof(window) != undefined && typeof(localStorage) != 'undefined')

  function updateStorage (key: string, value: T): void {
    if (browser) localStorage.setItem(key, JSON.stringify(value))
  }

  if (!stores[key]) {
    const store = internal(initialValue, (set) => {
      const json = browser ? localStorage.getItem(key) : null

      if (json) set(<T> JSON.parse(json));

      if (browser) {
        const handleStorage = (event: StorageEvent) => {
          if (event.key === key)
            set(event.newValue ? JSON.parse(event.newValue) : null)
        }

        window.addEventListener("storage", handleStorage)
        return () => window.removeEventListener("storage", handleStorage)
      }
    })

    const {subscribe, set} = store

    stores[key] = {
      set(value: T) {
        updateStorage(key, value)
        set(value)
      },
      update(updater: Updater<T>) {
        const value = updater(get(store))
        updateStorage(key, value)
        set(value)
      },
      subscribe
    }
  }

  return stores[key]
}

export default writable;
