class ErrorResponse extends Error {
  constructor(message, statusCode, tokenExpired = false) {
    super(message);
    this.statusCode = statusCode;
    this.tokenExpired = tokenExpired;
  }
}

module.exports = ErrorResponse;