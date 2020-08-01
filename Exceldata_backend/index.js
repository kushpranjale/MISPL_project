require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8080;
const router = require("./router");
const path = require("path");
const formData = require("express-form-data");
const os = require("os");
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};

// app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

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
app.use(formData.parse(options));
// app.use(formData.stream());
app.use(formData.union());
app.use("/api", router);
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
