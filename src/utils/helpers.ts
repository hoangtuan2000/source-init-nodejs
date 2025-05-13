import _ from "lodash";
import constants from "../constant/constants";



const convertStringToBoolean = (value: string) => {
  if (_.isString(value)) {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }

  return value;
};

const generatePagination = (pageNumber: number, pageSize: number, totalCounts: number) => {
  const totalPages = Math.ceil(totalCounts / pageSize);

  return {
    pageSize: pageSize,
    totalPages: totalPages,
    currentPage: pageNumber,
    totalCounts: totalCounts,
  };
};

const buildOptionalFieldsQueryParts = (optionalFields: any) => {
  const optionalColumns = optionalFields.map((item: any) => `, ${item}`).join("");
  const optionalValues = optionalFields.map((item: any) => `, @${item}`).join("");
  return {
    optionalColumns,
    optionalValues,
  };
};

const isStringEmpty = (value: any) => {
  return _.isNil(value) || (typeof value === "string" && _.isEmpty(value));
};

const isNumberEmpty = (value: any) => {
  return _.isNil(value) || (typeof value === "number" && _.isEmpty(value));
};

const compareNumbers = (a: any, b: any, condition: string, isAbsRequired = false) => {
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

export {
  isStringEmpty,
  isNumberEmpty,
  compareNumbers,
  generatePagination,
  convertStringToBoolean,
  buildOptionalFieldsQueryParts,
};
