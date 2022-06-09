/**
 * Higher-order function for async/await error handling
 * @param {function} fn an async function
 * @returns {function}
 */
 export const catchErrors = fn => {
    return function(...args) {
      fn(...args).catch((err) => {
        console.error(err);
      })
    }
  }