const _ = require("lodash");
const momentTimezone = require("moment-timezone");
const constants = require("../constant/constants");
const strings = require("../constant/strings");

const { convertUnitName } = constants;

const convertStringToBoolean = (value) => {
  if (_.isString(value)) {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }

  return value;
};

const generatePagination = (page, pageSize, totalRecords) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    currentPage: page,
    pageSize: pageSize,
    totalRecords: totalRecords,
    totalPages: totalPages,
  };
};

const buildOptionalFieldsQueryParts = (optionalFields) => {
  const optionalColumns = optionalFields.map((item) => `, ${item}`).join("");
  const optionalValues = optionalFields.map((item) => `, @${item}`).join("");
  return {
    optionalColumns,
    optionalValues,
  };
};

const formatDateToString = ({ dateTime, hasTime = false, formatDate }) => {
  const date = momentTimezone(dateTime);

  if (!date.isValid()) {
    return null;
  }

  return hasTime
    ? date.format(formatDate || constants.dateFormat.DATE_TIME)
    : date.format(formatDate || constants.dateFormat.DATE);
};

const getDateTimeUTC = () => {
  return new Date(momentTimezone.tz(momentTimezone(), "Asia/Ho_Chi_Minh"));
};

const getDateTimeLocal = ({
  location = "Asia/Ho_Chi_Minh",
  formatDate = constants.dateFormat.DATE_TIME_VN,
}) => {
  return momentTimezone.tz(momentTimezone(), location).format(formatDate);
};

// convert date time string VietNam to UTC
const convertDateTimeStringToUTC = (
  dateTime,
  timeZone = "Asia/Ho_Chi_Minh"
) => {
  return new Date(momentTimezone.tz(dateTime, timeZone));
};

const isStringEmpty = (value) => {
  return _.isNil(value) || (typeof value === "string" && _.isEmpty(value));
};

const getChangeValues = (originalData, changedData) => {
  let changes = {};
  for (let key in changedData) {
    // Compare new and old values, if different save changes
    if (key == "password" && changedData[key] !== originalData[key]) {
      changes[key] = {
        before: strings.auth.CHANGE_PASSWORD,
        after: strings.auth.CHANGE_PASSWORD,
      };
      continue;
    }
    if (changedData[key] !== originalData[key]) {
      changes[key] = {
        before: !isStringEmpty(originalData[key]) ? originalData[key] : null,
        after: !isStringEmpty(changedData[key]) ? changedData[key] : null,
      };
    }
  }
  return changes;
};

const getAddedValueHistory = ({ data, fieldsNotNull = [] }) => {
  if (!data || typeof data !== "object") return {};
  for (const [key, value] of Object.entries(data)) {
    if (fieldsNotNull.includes(key)) {
      if (value === null || value === undefined) {
        delete data[key];
      }
    }
  }
  return data;
};

const compareContractStatus = (contractStatusID, statusToCheck) => {
  const isCorrect = contractStatusID === statusToCheck;
  return isCorrect;
};

const buildUpdateQueryParts = (fields, query, params, newData) => {
  Object.keys(fields).forEach((field) => {
    if (
      !isStringEmpty(fields[field].value) ||
      fields[field]?.allowNull === true
    ) {
      if (params.length > 0) query += ", ";
      const { value, type, minLength, maxLength, alias } = fields[field];
      const colName = alias ? `${alias}.${field}` : field;
      query += `${colName} = @${field}`;

      const param = {
        name: field,
        type: type,
        value: value,
      };

      if (!isStringEmpty(minLength)) param.minLength = minLength;
      if (!isStringEmpty(maxLength)) param.maxLength = maxLength;

      params.push(param);
      newData[field] = value;
    }
  });

  return {
    query: query,
    params,
    newData,
  };
};

const compareNumbers = (a, b, condition, isAbsRequired = false) => {
  const numA = isAbsRequired ? Math.abs(Number(a)) : Number(a);
  const numB = isAbsRequired ? Math.abs(Number(b)) : Number(b);

  if (isNaN(numA) || isNaN(numB)) {
    throw new Error("Lỗi Không Thể Chuyển Về Dạng Số Để So Sánh");
  }

  switch (condition) {
    case constants.compareCondition.GREATER_THAN:
      return numA > numB;
    case constants.compareCondition.LESS_THAN:
      return numA < numB;
    case constants.compareCondition.GREATER_THAN_EQUAL:
      return numA >= numB;
    case constants.compareCondition.LESS_THAN_EQUAL:
      return numA <= numB;
    case constants.compareCondition.EQUAL:
      return numA === numB;
    case constants.compareCondition.NOT_EQUAL:
      return numA !== numB;
    default:
      throw new Error("Điều kiện so sánh không hợp lệ");
  }
};

const compareRangeNumber = (min, max, num) => {
  min = Number(min);
  max = Number(max);
  num = Number(num);

  if (isNaN(min) || isNaN(max) || isNaN(num)) {
    throw new Error("Lỗi Không Thể Chuyển Về Dạng Số Để So Sánh");
  }

  return num >= min && num <= max;
};

const isAllPositiveOrNegative = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return false;
  }
  const firstSign = Math.sign(arr[0]);
  return arr.every((num) => Math.sign(num) === firstSign && num !== 0);
};

const formatNumberWithSeparator = (number, separator = ",") => {
  // Convert the value to a number
  const numValue = Number(number);

  // Check if the value is not a number after conversion
  if (_.isNaN(numValue)) {
    return NaN;
  }

  const numStr = numValue.toString();
  const [integerPart, decimalPart] = numStr.split(".");

  // Add separators to the integer part
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  // If there is a decimal part, append it
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const roundToTwoDecimalPlaces = (num) => {
  return Number(Number(num).toFixed(2));
};

const roundNumber = (num) => {
  return Math.round(roundToTwoDecimalPlaces(num));
};

const ceilNumber = (num) => {
  return Math.ceil(roundToTwoDecimalPlaces(num));
};

const displayNumberOrDefault = (number) => {
  return !isStringEmpty(number)
    ? formatNumberWithSeparator(roundToTwoDecimalPlaces(number))
    : "--";
};

const isHasOwnProperty = (data = {}, key) => {
  return data.hasOwnProperty(key);
};

const generatePositionString = ({
  isConvertUnit,
  positionName,
  quantity,
  unitName,
  convertQty,
}) => {
  let posStr = "";
  posStr = `${positionName} = ${quantity}`;
  !isStringEmpty(unitName) && (posStr = posStr.concat(" ", unitName));
  if (isConvertUnit) {
    posStr = posStr.concat(" = ", `${convertQty} ${convertUnitName}`);
  }
  return posStr;
};

const convertPositionsToString = ({
  positions = [],
  positionKey,
  isConvertUnit = false,
  quantityKey,
  unitName,
  convertQtyKey,
}) => {
  return positions
    .map((item) =>
      generatePositionString({
        isConvertUnit,
        positionName: item[positionKey],
        quantity: displayNumberOrDefault(item[quantityKey]),
        unitName,
        convertQty: displayNumberOrDefault(item[convertQtyKey]),
      })
    )
    .join("\n");
};

const calcSumQuantity = ({
  data = [],
  quantityKey,
  noHasQuantityKey = false,
}) => {
  let sum = 0;
  if (noHasQuantityKey) {
    sum = data.reduce((total, field) => {
      return (total += Number(field || 0));
    }, 0);
  } else {
    sum = data.reduce((total, field) => {
      return (total += Number(field[quantityKey] || 0));
    }, 0);
  }
  return roundToTwoDecimalPlaces(sum);
};

const calcSumQuantityWithCondition = ({
  data = [],
  keysCheck = [],
  matchAllConditions = true,
  keyQuantity = "quantity",
}) => {
  let result = data.reduce((total, field) => {
    const isValid = matchAllConditions
      ? keysCheck.every((key) => field[key])
      : keysCheck.some((key) => field[key]);

    if (isValid && !isNaN(field[keyQuantity])) {
      return (total += parseFloat(field[keyQuantity]));
    }

    return total;
  }, 0);
  return roundToTwoDecimalPlaces(result);
};

const calcSubtractQuantity = ({
  data = [],
  quantityKey,
  noHasQuantityKey = false,
}) => {
  if (data.length === 0) return 0;

  let result = 0;
  if (noHasQuantityKey) {
    result = data.slice(1).reduce((total, field) => {
      return total - Number(field || 0);
    }, Number(data[0] || 0));
  } else {
    result = data.slice(1).reduce((total, field) => {
      return total - Number(field[quantityKey] || 0);
    }, Number(data[0][quantityKey] || 0));
  }
  return roundToTwoDecimalPlaces(result);
};

const getContractStatusNameByID = (id) => {
  switch (id) {
    case constants.contractStatus.PREPARATION:
      return constants.contractStatusName.PREPARATION;
    case constants.contractStatus.IN_PROGRESS:
      return constants.contractStatusName.IN_PROGRESS;
    case constants.contractStatus.PAUSED:
      return constants.contractStatusName.PAUSED;
    case constants.contractStatus.COMPLETED:
      return constants.contractStatusName.COMPLETED;
    default:
      return "--";
  }
};

const compareDateTime = ({
  startTime,
  endTime,
  condition = constants.compareCondition.LESS_THAN,
  granularity = "minute",
}) => {
  switch (condition) {
    case constants.compareCondition.GREATER_THAN:
      return momentTimezone(startTime).isAfter(
        momentTimezone(endTime),
        granularity
      );
    case constants.compareCondition.LESS_THAN:
      return momentTimezone(startTime).isBefore(
        momentTimezone(endTime),
        granularity
      );
    case constants.compareCondition.GREATER_THAN_EQUAL:
      return momentTimezone(startTime).isSameOrAfter(
        momentTimezone(endTime),
        granularity
      );
    case constants.compareCondition.LESS_THAN_EQUAL:
      return momentTimezone(startTime).isSameOrBefore(
        momentTimezone(endTime),
        granularity
      );
    case constants.compareCondition.EQUAL:
      return momentTimezone(startTime).isSame(
        momentTimezone(endTime),
        granularity
      );
    default:
      throw new Error("Điều kiện so sánh ngày giờ không hợp lệ");
  }
};

const convertUTCToTimeZoneString = (
  dateTimeUTC,
  format = constants.dateFormat.DATE,
  timeZone = "Asia/Ho_Chi_Minh"
) => {
  return momentTimezone.utc(dateTimeUTC).tz(timeZone).format(format);
};

const displayDateOrDefault = (
  date,
  format = constants.dateFormat.DATE_VN,
  defaultValue = "--"
) => {
  return date ? convertUTCToTimeZoneString(date, format) : defaultValue;
};

module.exports = {
  convertStringToBoolean,
  generatePagination,
  buildOptionalFieldsQueryParts,
  formatDateToString,
  getDateTimeUTC,
  getDateTimeLocal,
  convertDateTimeStringToUTC,
  isStringEmpty,
  getChangeValues,
  getAddedValueHistory,
  compareContractStatus,
  buildUpdateQueryParts,
  compareNumbers,
  compareRangeNumber,
  isAllPositiveOrNegative,
  formatNumberWithSeparator,
  roundToTwoDecimalPlaces,
  roundNumber,
  ceilNumber,
  displayNumberOrDefault,
  isHasOwnProperty,
  convertPositionsToString,
  calcSumQuantity,
  calcSumQuantityWithCondition,
  calcSubtractQuantity,
  getContractStatusNameByID,
  compareDateTime,
  displayDateOrDefault,
};
