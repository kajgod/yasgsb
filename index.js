//#region THE GLOBALS: 3rd party modules & environment variables
///////////////////////////////////////////////////////////////////
// app, http = parts of Express library
// io = part pf Socket.IO library
// isRoot = checks if the process is started as root (sudo etc.) - always returns boolean!
// port = port for the application
// PORT HAS THREE OPTIONS:
// 1. set in environment as PORT (this can be doen either as a command line ex.
//    PORT=1984 node index.js
//    or (recomended) via an .env file in root)
// 2. defaults to 80 if environment isn't set, but ONLY if ran as root (sudo node index.js)
// 3. defaults to 1984 if neither of the above
///////////////////////////////////////////////////////////////////
require("dotenv").config(); // read .env file if exists
const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const isRoot = process.getuid && process.getuid() === 0;
const port = process.env.PORT || (isRoot ? 80 : 1984);
//#endregion

//#region FRAMEWORK: folders and defaults
///////////////////////////////////////////////////////////////////
// FOLDERS:
// public = public folder (.js, .css, .json etc.)
// views = templates folder (uses handlebars, a very simple to use templating engine (https://handlebarsjs.com/)
// views/404.hbs = 404 page
// views/500.hbs = error page
///////////////////////////////////////////////////////////////////
app.use("/public", express.static(__dirname + "/../../public")); 
const templatedir = __dirname + "/../../templates";
app.set("views", templatedir);
app.set("view engine", "hbs");
app.get("/:template", function(req, res) {
  const filename = req.params.template;
  fs.access(templatedir + "/" + filename + ".hbs", fs.F_OK, err => {
    if (err) {
      res.status(404).render(templatedir + "/404.hbs");
      return;
    }
    res.render(filename + ".hbs");
  });
});
app.use(function (req, res) {
  res.status(404).render(templatedir + "/404.hbs");
});
app.use(function (err, req, res) {
  console.error(err.stack)
  res.status(500).render(templatedir + "/500.hbs");
});
//#endregion

//#region EXPORTS
///////////////////////////////////////////////////////////////////
// we export:
// 1. app = express' object with methods for hosting custom dynamic files (https://expressjs.com/)
// 2. io = socket.io's object with methods for web socket communications with fallbacks (https://socket.io/)
///////////////////////////////////////////////////////////////////
http.listen(port, "localhost", function() {
  console.log("Server active on port: " + port);
});
module.exports = {
  app,
  io
};
//endregion
