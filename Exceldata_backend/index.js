const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8080;
const router = require("./router");

mongoose
  .connect(
    "mongodb+srv://lav:fL6ytZix7wPGBT58@cluster0-jltch.mongodb.net/project_db?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected!!!");
  })
  .catch((err) => {
    console.log("not connected!!! " + err);
  });
mongoose.set("useCreateIndex", true);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
