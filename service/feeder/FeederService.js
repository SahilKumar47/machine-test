const pgDB = require("../../dbconnector/pgConnector");
const sqliteDB = require("../../dbconnector/sqliteConnector");
const compare = require("../../utils/compare");
const { performance } = require("perf_hooks");
const weblogger = require("../../utils/logger");

module.exports = {
  Get: () => {
    return new Promise(async (resolve, reject) => {
      const query = `Select * from feeder_master`;
      try {
        let pgResponseData = await pgDB.GenericQuery(query);
        let sqliteResponseData = await sqliteDB.GenericQuery(query);
        let startTime = performance.now();
        let data = compare(sqliteResponseData, pgResponseData);
        let endTime = performance.now();
        let performanceTime = (endTime - startTime).toPrecision(3);
        data["performaceTime"] = `${performanceTime}`;
        resolve(data);
      } catch (error) {
        weblogger.error(error);
      }
    });
  },
};
