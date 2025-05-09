const strings = require("../../constant/strings");
const HttpError = require("../../utils/httpError");
const formatDataHelpers = require("../../utils/formatDataHelpers");
const globalServices = require("../../services/globalServices/globalServices");

const globalActions = {
  // CREATE
  async create({ transaction, name }) {
    try {
      // create receipt
      const nameFormat = formatDataHelpers.name(name);

      const result = await globalServices.create({
        transaction,
        name: nameFormat,
      });

      if (result.rowsAffected[0] <= 0) {
        throw new HttpError(strings.error.CANNOT_ADD, 500);
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = globalActions;
