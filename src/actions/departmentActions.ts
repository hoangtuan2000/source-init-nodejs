import strings from "../constant/strings";
import { IReqCreateDepartment } from "../model/department";
import DepartmentServices from "../services/departmentServices";

const DepartmentActions = {
  // DETAIL
  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    try {
      // create receipt
      const result = await DepartmentServices.getDetail({
        transaction,
        id: id,
      });

      if (result.rowsAffected[0] <= 0) {
        // throw new HttpError(strings.error.CANNOT_ADD, 500);
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  // CREATE
  async create({ transaction, data }: { transaction: any, data: IReqCreateDepartment }) {
    try {
      // create receipt
      const result = await DepartmentServices.create({
        transaction,
        data: data,
      });

      if (result.rowsAffected[0] <= 0) {
        // throw new HttpError(strings.error.CANNOT_ADD, 500);
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default DepartmentActions;
