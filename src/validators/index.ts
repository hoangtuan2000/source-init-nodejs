import commonRules from "../validateRules/commonRules";
import departmentRules from "../validateRules/departmentRules";

const validatePagination = [
  commonRules.pageSize(),
  commonRules.sortOrder(),
  commonRules.pageNumber(),
];

const validateLogin = [
  commonRules.accountLogin(),
  commonRules.passwordLogin(),
];

const validateDepartment = [
  commonRules.code(),
  commonRules.name(),
];

export {
  validateLogin,
  validatePagination,
  validateDepartment,
};
