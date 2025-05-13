import { check } from "express-validator";

const commonRules = {
  pageNumber() {
    return check("pageNumber").isInt().withMessage("PageNumber phải là số nguyên");
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
    return check("userName")
      .isLength({
        min: 1,
      })
      .withMessage(`Vui lòng nhập thông tin tài khoản`);
  },

  passwordLogin() {
    return check("password")
      .isLength({
        min: 1,
      })
      .withMessage(`Vui lòng nhập thông tin mật khẩu`);
  },

  code() {
    return check("code")
      .isLength({ min: 1 })
      .withMessage(`Vui lòng nhập mã`);
  },

  name() {
    return check("name")
      .isLength({ min: 1 })
      .withMessage(`Vui lòng nhập tên`);
  },

};

export default commonRules;
