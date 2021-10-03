import type { Word } from "../types";

export function eachPrefix(word: Word, fn: (prefix: string) => void): void {
  const spelling = word.id;
  const length = spelling.length;
  if (length > 0) {
    for (let last = 1; last <= length; last++) {
      fn(spelling.substr(0, last));
    }
  }
}
