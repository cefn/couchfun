/** Callback fn once with every prefix of text. */
export function eachPrefix(
  text: string,
  fn: (prefix: string) => unknown
): void {
  const length = text.length;
  if (length > 0) {
    for (let last = 1; last <= length; last++) {
      fn(text.substr(0, last));
    }
  }
}
