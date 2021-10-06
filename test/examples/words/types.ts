import { Doc } from "../../../src/types";

export type Word = Doc & {
  type: "word";
};

export function docIsWord(doc: Doc): doc is Word {
  return (doc as unknown as { type: string }).type === "word";
}
