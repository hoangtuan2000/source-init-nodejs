const { sql } = require("../../config/dbConfig");

const globalServices = {
  // GET
  async getInfo({ transaction, id }) {
    const result = await transaction.request().input("id", sql.Int, id).query(`
        SELECT * FROM Global
        WHERE id = @id;
      `);
    return result.recordset[0];
  },

  // CREATE
  async create({ transaction, name }) {
    const result = await transaction.request().input("name", sql.Char, name)
      .query(`
        SQL QUERY
      `);
    return result;
  },
};

module.exports = globalServices;
