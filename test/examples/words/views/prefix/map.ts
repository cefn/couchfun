import "../../../../../src/builtins/map";
import type { Doc } from "../../../../../src/types";
import { docIsWord } from "../../types";
import { eachPrefix } from "../../../../lib/eachPrefix";

function emitPrefixes(doc: Doc) {
  if (docIsWord(doc)) {
    eachPrefix(doc._id, emit);
  }
}

emitPrefixes;
