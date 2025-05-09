const { validationResult } = require("express-validator");
const { errorResponse } = require("./responseFormatter");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return errorResponse(res, null, `${errorMessages.join("\n")}`, 400);
  }
  next();
};

module.exports = handleValidationErrors;
