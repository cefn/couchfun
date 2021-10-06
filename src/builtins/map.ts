import type { EmitFunction } from "../types";

declare global {
  const emit: EmitFunction<string>;
}
