import { log, logError, universalCatch } from "./logging";

export const loggerMiddleware = (store) => (next) => (action) => {
  log(`dispatching ${action.type}`, "debug");
  if (action.error) {
    logError(action.error);
  }
  const result = next(action);
  log(`next state:\n${JSON.stringify(store.getState())}`, "debug");
  return result;
};

// eslint-disable-next-line no-unused-vars
export const crashReportingMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    universalCatch(err);

    throw err;
  }
};
