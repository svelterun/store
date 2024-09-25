export interface StorageKeyTypes {
  string: string;
  number: number;
}

export type StorageKey = StorageKeyTypes[keyof StorageKeyTypes];

/**
 * Abstract storage adapter class used by the various persisted stores provided
 * by the `@svelterun/store` package. This class is not directly constructable,
 * but is used as a common superclass for storage adapters that intergrate with
 * the browser's built-in WebStorage API.
 *
 * @example
 * ```ts
 * import { Adapter } from "@svelterun/store/adapter";
 * import * as yaml from "js-yaml";
 *
 * export class LocalYamlAdapter<K extends string, V> extends Adapter<K, V> {
 *   constructor(initialValues?: Iterable<[K, V]>) {
 *     super();
 *
 *   }
 *
 * }
 * ```
 * @abstract
 */
export abstract class Adapter<K extends StorageKey = StorageKey, V = any> {
}
