const packageJson = require("../package.json");

const APP_NAME = packageJson.name;
const VERSION = packageJson.version;
const getRouter = (entity) => `../entities/${entity}/${entity}Routes`;
const AuthMiddleware = require('../middlewares/AuthMiddleware');

module.exports = (app) => {

  app.use("/offers",
    AuthMiddleware,
    require(getRouter("offers"))
  );

  app.use("/requests",
    AuthMiddleware,
    require(getRouter("requests"))
  );

  app.get("/status", function status(req, res) {
    return res.json({
      app: APP_NAME,
      version: VERSION,
    });
  });
};