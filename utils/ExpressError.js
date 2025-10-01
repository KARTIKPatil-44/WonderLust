class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // Pass message to the parent Error class
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Optional: better stack trace
  }
}

module.exports = ExpressError;
