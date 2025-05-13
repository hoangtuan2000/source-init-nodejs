import { sql } from "../config/dbConfig";
import { IReqCreateDepartment, IReqUpdateDepartment } from "../model/department";

const DepartmentServices = {
  // GET ALL
  async getAll({ transaction, type }: { transaction: any, type?: number }) {
    const result = await transaction.request().input("type", sql.Int, type).query(`
        SQL QUERY
      `);
    return result.recordset[0];
  },

  // GET PAGE
  async getPage({ transaction }: { transaction: any, data?: any }) {
    const result = await transaction.request().query(`
        SQL QUERY
      `);
    return result.recordset[0];
  },


  // GET DETAIL
  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    const result = await transaction.request().query(`
        SELECT * FROM Department
        WHERE id = @id;
      `);
    return result.recordset[0];
  },

  // CREATE
  async create({ transaction, data }: { transaction: any, data: IReqCreateDepartment }) {
    const result = await transaction.request().query(`
        SQL QUERY
      `);
    return result;
  },

  // UPDATE
  async update({ transaction, data }: { transaction: any, data: IReqUpdateDepartment }) {
    const result = await transaction.request().query(`
        SQL QUERY
      `);
    return result;
  },

  // DELETE
  async delete({ transaction, id }: { transaction: any, id: string }) {
    const result = await transaction.request()
      .input("id", sql.Int, id)
      .query(`
        SQL QUERY
      `);
    return result;
  },
};

export default DepartmentServices;
