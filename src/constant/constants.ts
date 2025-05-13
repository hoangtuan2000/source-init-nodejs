const constants = {

  boolean: {
    TRUE: 1,
    FALSE: 0,
  },

  status: {
    ACTIVE: 1,
    DISABLE: 0,
  },

  typeDepartment: {
    DEPARTMENT: 1,
    GROUP: 2,
    OTHER: 3,
  },

  typeDisplay: {
    PUBLIC: 1,
    CUSTOM: 2,
  },

  typeAction: {
    CREATE: 1,
    UPDATE: 2,
    DELETE: 3,
  },

  role: {
    ADMIN: "000001",
    NORMAL: "000008",
    SUPPER_ADMIN: "000000",
  },

  codeNameCommon: {
    USER_TITLE: "CD",
    TYPE_POST: "TP",
    TAG: "TAG",
    STATUS: "STATUS",
    ACTION: "ACTION",
  },

  compareCondition: {
    GREATER_THAN: ">",
    LESS_THAN: "<",
    GREATER_THAN_EQUAL: ">=",
    LESS_THAN_EQUAL: "<=",
    EQUAL: "==",
    NOT_EQUAL: "!=",
  },
};

export default constants;
