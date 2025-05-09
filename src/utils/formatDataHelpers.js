const _ = require("lodash");

const formatDataHelpers = {
  name(value) {
    return value.trim().toUpperCase();
  },
};

module.exports = formatDataHelpers;
