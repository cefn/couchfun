/** Ten Three letter words starting with 'a' from the debian 'wbritish' wordlist...
 * ```
 * cat /usr/share/dict/words | grep -P '^a[a-z]{2}$' | head -n10 | xargs -n1 -I{} echo '"{}",'
 * ```
 */
export const words = [
  "ace",
  "act",
  "add",
  "ado",
  "ads",
  "aft",
  "age",
  "ago",
  "aha",
  "aid"
];
