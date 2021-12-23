const express = require("express");
const cors = require("cors");
const path = require("path");
const pgDB = require("./dbconnector/pgConnector");
const sqliteDB = require("./dbconnector/sqliteConnector");
const PropertiesReader = require("properties-reader");
const appConfigPath = "./appconfig.properties";
const prop = PropertiesReader(appConfigPath);
const weblogger = require("./utils/logger");

const feederRoutes = require("./routes/feeder/FeederRouter");

const app = express();
const port = prop.get("server.port");

//Load Template Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.use("/api/feeder", feederRoutes);

app.get("/", (req, res) => {
  res.render("index.pug");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  pgDB
    .Connect()
    .then(() => {
      weblogger.info("Postgres Db Connected");
      sqliteDB
        .Connect()
        .then(() => {
          weblogger.info("Sqlite DB Connected");
        })
        .catch((error) => {
          weblogger.error(error);
          console.log(error);
        });
    })
    .catch((error) => {
      weblogger.error(error);
      console.log(error);
    });
});
