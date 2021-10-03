import { Doc } from "../../../src/types";

export type Word = Doc<"word">;

export function docIsWord(doc: Doc): doc is Word {
  return doc.type === "word";
}
