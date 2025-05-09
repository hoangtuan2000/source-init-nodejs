const { globalRules } = require("../../validateRules/globalRules");

const validateFilters = [globalRules.filters()];

const validatePagination = [
  globalRules.page(),
  globalRules.pageSize(),
  globalRules.sortOrder(),
  globalRules.filters(),
];

const validateLogin = [globalRules.accountLogin(), globalRules.passwordLogin()];

module.exports = {
  validateFilters,
  validatePagination,
  validateLogin,
};
