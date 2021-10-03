import type { Doc, EmitFunction } from "../../../../../src/types";
import { docIsWord } from "../../types";
import { eachPrefix } from "../util";

// eslint-disable-next-line no-var
declare var emit: EmitFunction<string>;

function emitPrefixes(doc: Doc) {
  if (docIsWord(doc)) {
    eachPrefix(doc, emit);
  }
}

emitPrefixes;
