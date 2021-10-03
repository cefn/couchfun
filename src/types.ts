/** CouchDB types */

/** Type for documents inserted to db. */
export interface Doc<
  TypeName extends string = string,
  Id extends string = string
> {
  type: TypeName;
  id: Id;
}

/** Called once for each document inserted or updated.
 * An EmitFunction called `emit` will be in scope within the
 * map function, which should be called to insert rows in the index.
 * @see {@link https://docs.couchdb.org/en/stable/ddocs/ddocs.html#map-functions|CouchDB map function docs}
 */
export type MapFunction<D extends Doc> = (doc: D) => void;

/** An emit function in scope when a map function runs in couchdb,
 * which should be called to insert rows in the index.
 * An example declaration of `emit` in a typescript map function
 * might look like...
 * ```
 * type Key = string;
 * type Value = string;
 * import type {EmitFunction} from "couchfun"
 * declare var emit: EmitFunction<Key, Value>;
 * ```
 */
export type EmitFunction<
  K extends JsonEntry,
  V extends JsonEntry | never = never
> = (key: K, value?: V) => void;

/** Called with the aggregated keys and values passed to EmitFunction
 * and should produce a single value representing the reduction of
 * all the passed items
 * @see {@link https://docs.couchdb.org/en/stable/ddocs/ddocs.html#reduce-and-rereduce-functions|CouchDB reduce function docs}
 */
export type ReduceFunction<
  K extends JsonEntry,
  V extends JsonEntry,
  R extends JsonEntry,
  Id extends string = string
> = (pairs: Array<[K, Id]>, values: V[], rereduce: boolean) => R;

/** Utility JSON types */

export type JsonPrimitive = number | string | boolean | null;

export type JsonEntry = JsonPrimitive | JsonArray | JsonMap;

export type JsonArray = JsonEntry[];

export interface JsonMap {
  [key: string]: JsonEntry;
}
