const { sql, getConnection } = require("../../config/dbConfig");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseFormatter");
const strings = require("../../constant/strings");
const globalActions = require("../../actions/globalActions/globalActions");

// GET
const createGlobal = async (req, res) => {
  const { name } = req.body;
  try {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    await globalActions.create({
      transaction,
      name,
    });

    // Commit Transaction
    await transaction.commit();
    successResponse(res, result.recordset[0], strings.common.SUCCESS);
  } catch (error) {
    errorResponse(
      res,
      error,
      error?.errorMessage || strings.error.INTERNAL_SERVER_ERROR,
      error?.statusCode
    );
  }
};

module.exports = {
  // GET
  createGlobal,
};
