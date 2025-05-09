const { getConnection } = require("../../config/dbConfig");
const strings = require("../../constant/strings");
const { isStringEmpty } = require("../../utils/helpers");
const { errorResponse } = require("../../utils/responseFormatter");
const globalServices = require("../../services/globalServices/globalServices");

const checkExist = async (req, res, next) => {
  const { id } = req.body; // Replace ID with parameter to check
  try {
    // do not pass accountCode parameter
    if (isStringEmpty(id)) {
      errorResponse(res, error, strings.common.NOT_ENOUGH_DATA, 400);
      return;
    }

    const pool = await getConnection();
    // Check exist
    const isExist = await globalServices.getInfo({
      transaction: pool,
      id: id,
    });
    if (isExist) {
      errorResponse(res, null, strings.error.INTERNAL_SERVER_ERROR, 400);
      return;
    }

    next();
  } catch (error) {
    errorResponse(res, error, strings.error.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  checkExist,
};
