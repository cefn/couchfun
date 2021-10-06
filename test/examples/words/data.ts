/** Ten Three letter words starting with 'a' from the debian 'wbritish' wordlist...
 * ```
 * cat /usr/share/dict/words | grep -P '^a[a-z]{2}$' | head -n5 | xargs -n1 -I{} echo '"{}",'
 * ```
 */
export const WORDS = ["ace", "act", "add", "ado", "ads"] as const;
