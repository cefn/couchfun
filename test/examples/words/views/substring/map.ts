import "../../../../../src/builtins/map";
import type { Doc } from "../../../../../src/types";
import { docIsWord } from "../../types";
import { eachSubstring } from "../util";

function emitPrefixes(doc: Doc) {
  if (docIsWord(doc)) {
    eachSubstring(doc, emit);
  }
}

emitPrefixes;
