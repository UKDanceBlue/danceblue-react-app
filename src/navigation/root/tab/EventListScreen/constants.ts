// This constant determines how many months are loaded at once (i.e. how many pages are loaded in the PagerView)
export const LOADED_MONTHS = 7 as const;
if (__DEV__ && LOADED_MONTHS % 2 === 0) {
  throw new Error(`LOADED_MONTHS must be odd, but is ${LOADED_MONTHS}`);
}
export const LOADED_MONTHS_BEFORE_AFTER = Math.floor(LOADED_MONTHS / 2);
if (__DEV__ && LOADED_MONTHS_BEFORE_AFTER < 1) {
  throw new Error(`LOADED_MONTHS_BEFORE_AFTER must be at least 1, but is ${LOADED_MONTHS_BEFORE_AFTER}`);
}
