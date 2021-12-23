const promise = require("promise");
const path = require("path");
const PropertiesReader = require("properties-reader");
const appConfigPath = path.join(__dirname, "..", "appconfig.properties");
const prop = PropertiesReader(appConfigPath);

const initOptions = {
  promiseLib: promise,
};

const pgp = require("pg-promise")(initOptions);
pgp.pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

// Database connection details;
const connection = {
  host: prop.get("datasource.host.ip"),
  user: prop.get("datasource.username"),
  database: prop.get("datasource.database.name"),
  password: prop.get("datasource.password"),
  port: prop.get("datasource.port.number"),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
};

const db = pgp(connection);

//Functions or variables to be exported
let DBTemplate = {
  /**
   * @description Function to test database connection
   */
  Connect: function () {
    return new Promise((resolve, reject) => {
      //function to connect to database
      db.connect()
        .then(function (obj) {
          resolve(true, obj);
        })
        .catch(function (error) {
          reject(new Error(error.message));
        });
    });
  },

  /**
   * @description Function to execute customized query
   * @param  {string} query
   * @param  {function} callback
   */
  GenericQuery: function (genericQuery) {
    return new Promise((resolve, reject) => {
      db.result(genericQuery, false)
        .then((result) => {
          resolve(result.rows);
        })
        .catch((error) => {
          reject(new Error(error.message));
        });
    });
  },
};

//module to export
module.exports = DBTemplate;
