const { check } = require("express-validator");

const globalRules = {
  filters() {
    return check("filters")
      .optional()
      .isObject()
      .withMessage("Filters phải là một object")
      .bail({ level: "request" });
  },

  page() {
    return check("page").isInt().withMessage("Page phải là số nguyên");
  },

  pageSize() {
    return check("pageSize").isInt().withMessage("PageSize phải là số nguyên");
  },

  sortOrder() {
    return check("sortOrder")
      .optional()
      .custom((value) => {
        const sort = value.toUpperCase();
        if (typeof value === "string" && (sort === "ASC" || sort === "DESC"))
          return true;
        throw new Error("SortOrder phải là 'ASC' hoặc 'DESC'");
      });
  },

  accountLogin() {
    return check("accountCode")
      .isLength({
        min: 1,
      })
      .withMessage(`Tải Khoản Là Bắt Buộc`);
  },

  passwordLogin() {
    return check("password")
      .isLength({
        min: 1,
      })
      .withMessage(`Mật khẩu Là Bắt Buộc`);
  },
};

module.exports = { globalRules };
