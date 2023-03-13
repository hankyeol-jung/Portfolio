const express = require("express");
const path = require("path");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");

app.use(express.json());
let cors = require("cors");
app.use(cors());

let db;
MongoClient.connect(
  "mongodb+srv://admin:qwer1234@cluster0.ghdzi.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (error, client) {
    if (error) return console.log(error);
    db = client.db("portfolio");

    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  }
);

app.post("/join", function (req, res) {
  let password = req.body.password;
  let saltRounds = 10;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.error(err);
    } else {
      db.collection("user").insertOne(
        {
          userId: req.body.userId,
          password: hash,
          username: req.body.username,
          email: req.body.email,
          userphone: req.body.userphone,
        },
        function (error, result) {
          console.log(error);
        }
      );
    }
  });

  res.redirect("/login");
});

app.get("/join/idChk", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await db.collection("user").findOne({ userId });
    if (user) {
      res.json({ isUnique: false });
    } else {
      res.json({ isUnique: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
});

app.use(express.static(path.join(__dirname, "front-end/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/front-end/build/index.html"));
});
