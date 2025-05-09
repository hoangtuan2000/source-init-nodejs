const constants = {
  actionType: {
    INSERT: 1,
    UPDATE: 2,
    DELETE: 3,
  },

  boolean: {
    TRUE: 1,
    FALSE: 0,
  },

  status: {
    ACTIVE: 1,
    DISABLE: 0,
  },

  role: {
    ADMIN: 1
  },

  dateFormat: {
    DATE: "YYYY-MM-DD",
    DATE_TIME: "YYYY-MM-DD HH:mm:ss",
    DATE_VN: "DD/MM/YYYY",
    DATE_TIME_VN: "DD/MM/YYYY HH:mm:ss",
    DATE_TIME_VN_V2: "DD-MM-YYYY (HH[ gio ]mm[ phut ]ss)",
    DATE_VN_V2: "DD-MM-YYYY",
  },

  filterColumnType: {
    STRING: 1,
    BOOLEAN: 2,
    DATE: 3,
    NUMBER: 4,
    ARRAY: 5,
    EXACT_STRING: 6,
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

module.exports = constants;
