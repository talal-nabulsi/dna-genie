/** Lower-cases a leading ordinary word and leaves names such as C282Y alone. */
export const lead = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
