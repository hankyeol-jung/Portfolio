const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
var cors = require("cors");
app.use(cors());

app.listen(8080, function () {
  console.log("listening on 8080");
});

app.use(express.static(path.join(__dirname, "front-end/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/front-end/build/index.html"));
});
