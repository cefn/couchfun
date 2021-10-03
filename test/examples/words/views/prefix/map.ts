import type { Doc, EmitFunction } from "../../../../../src/types";
import { docIsWord } from "../../types";
import { eachPrefix } from "../util";

declare const emit: EmitFunction<string>;

function emitPrefixes(doc: Doc) {
  if (docIsWord(doc)) {
    eachPrefix(doc, emit);
  }
}

emitPrefixes;
