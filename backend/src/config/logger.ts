/* super minimal logger abstraction for now */
export const logger = {
  info: console.log.bind(console, "[INFO]"),
  error: console.error.bind(console, "[ERROR]"),
};
