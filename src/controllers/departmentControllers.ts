import { isStringEmpty } from "../utils/helpers";
import { sql, getConnection } from "../config/dbConfig";
import { errorResponse, successResponse } from "../utils/responseFormatter";

import strings from "../constant/strings";
import departmentActions from "../actions/departmentActions";



const checkExist = async (req: any, res: any, next: any) => {
  const { id, code } = req.body; // Replace ID with parameter to check
  try {
    // do not pass accountCode parameter
    if (isStringEmpty(id)) {
      errorResponse({
        res,
        error: null,
        message: strings.common.NOT_ENOUGH_DATA,
        statusCode: 400,
      });
      return;
    }

    const pool = await getConnection();
    // Check exist
    const isExist = await departmentActions.getDetail({
      transaction: pool,
      id: id,
    });
    if (isExist) {
      errorResponse({
        res,
        error: null,
        message: strings.error.INTERNAL_SERVER_ERROR,
        statusCode: 400,
      });
      return;
    }

    next();
  } catch (error) {
    errorResponse({
      res,
      error,
      message: strings.error.INTERNAL_SERVER_ERROR,
      statusCode: 400,
    });
  }
};

const getAllDepartment = async (req: any, res: any) => {

};

const getPageDepartment = async (req: any, res: any) => {

};

const getDetailDepartment = async (req: any, res: any) => {

};

const createDepartment = async (req: any, res: any) => {
  const { code, name, type, group, description } = req.body;
  try {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    const result = await departmentActions.create({
      transaction,
      data: { code, name, type, description, group },
    });

    // Commit Transaction
    await transaction.commit();
    successResponse({
      res,
      data: result.recordset[0],
      message: strings.common.SUCCESS,
      pagination: null,
      statusCode: 200,
    });
  } catch (error: any) {
    errorResponse({
      res,
      error,
      message: error?.errorMessage || strings.error.INTERNAL_SERVER_ERROR,
      statusCode: error?.statusCode
    });
  }
};

const updateDepartment = async (req: any, res: any) => {

};

const deleteDepartment = async (req: any, res: any) => {

};

export {
  checkExist,
  getAllDepartment,
  getPageDepartment,
  getDetailDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
