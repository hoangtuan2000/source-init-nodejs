class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.errorMessage = message;
    this.statusCode = statusCode;
  }
}

module.exports = HttpError;
