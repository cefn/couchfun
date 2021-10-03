import type { JsonEntry, ReduceFunction } from "./types";
declare module "builtins" {
  export const _sum: ReduceFunction<JsonEntry, JsonEntry, number>;
}
