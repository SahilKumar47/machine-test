//Module Dependencies
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const PropertiesReader = require("properties-reader");
const path = require("path");
const fs = require("fs");

const appConfig = path.join(__dirname, "..", "appconfig.properties");
//Reading properties file
const prop = PropertiesReader(appConfig);

let db;
//Function to be exported
var SQLiteDBTemplate = {
  /**
   * @description Function to create database connection
   */
  Connect: () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!fs.existsSync(prop.get("sqlite.database.path"))) {
          throw new Error("Database file doesn't exist");
        }
        db = await open({
          filename: prop.get("sqlite.database.path"),
          driver: sqlite3.cached.Database,
        });
        resolve(true);
      } catch (err) {
        reject(err.message);
      }
    });
  },
  GenericQuery: function (query) {
    return new Promise((resolve, reject) => {
      db.all(query)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          resolve(new Error(error.message));
        });
    });
  },
};

module.exports = SQLiteDBTemplate;
