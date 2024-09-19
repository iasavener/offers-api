const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const Config = require("./config");
const routes = require("./routes");
const useragent = require('express-useragent');
const { sequelize } = require('./helpers/sql/associations');

const startServer = async () => {

  try {
      await sequelize.authenticate();
      await sequelize.sync({});
      console.log('Conexión con la base de datos general establecida con éxito.');
  } catch (error) {
      console.error('Error al conectar o sincrizar la base de datos :', error);
  }
const app = express();

app.use(useragent.express());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(helmet());


app.use('/', routes);


app.listen(Config.PORT, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  console.log(`Running at port ${Config.PORT}`);
});
};

startServer();