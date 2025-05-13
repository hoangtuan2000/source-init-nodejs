import { validationResult } from "express-validator";
import { errorResponse } from "./responseFormatter";

const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: any) => error.msg);
    return errorResponse({
      res,
      error: null,
      message: `${errorMessages.join("\n")}`,
      statusCode: 400,
    });
  }
  next();
};

export default handleValidationErrors;
