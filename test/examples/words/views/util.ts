import type { Word } from "../types";

export function eachPrefix(word: Word, fn: (prefix: string) => unknown): void {
  const spelling = word._id;
  const length = spelling.length;
  if (length > 0) {
    for (let last = 1; last <= length; last++) {
      fn(spelling.substr(0, last));
    }
  }
}
