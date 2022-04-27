const express = require("express");
const app = express();

module.exports = () => {
  app.listen(3000);

  app.get("/", (req, res) => {
    res.send("JavaSkripp is currently online!");
  });
};
