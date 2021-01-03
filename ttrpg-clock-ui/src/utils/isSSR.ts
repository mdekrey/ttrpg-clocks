/** If server-side rendering, return true. Otherwise, false. */
export const isSSR = () => typeof document === "undefined";
