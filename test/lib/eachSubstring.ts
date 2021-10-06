/** Callback fn once with every substring in word. */
export function eachSubstring(
  text: string,
  fn: (prefix: string) => unknown
): void {
  const length = text.length;
  if (length > 0) {
    for (let first = 0; first < length; first++) {
      for (let last = 1; last <= length; last++) {
        fn(text.substr(first, last));
      }
    }
  }
}
