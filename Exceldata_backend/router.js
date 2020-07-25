const ExcelDataController = require("./controller/ExcelData");
const base64 = require("base-64");
const FileReader = require("filereader");
const fs = require("fs");
// const path = require ()
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
router.get("/excel_data", ExcelDataController.getAllData);
router.post("/add_excel", ExcelDataController.create);
const sgMail = require("@sendgrid/mail");
const { log } = require("console");

sgMail.setApiKey(
  "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"
);

router.post("/sendMail", (req, res) => {
  //  let  attachment

  var reader = new FileReader();
  reader.readAsDataURL(req.body.file);
  reader.onload = async function () {
    //  attachment = await reader.result
    await SendMailTo(reader.result, req.body.email, res);
  };

  //  console.log(attachment)
  //  console.log(fs.readFileSync(req.body.file).toString("base64") )
  //  console.log(req.files[Object.keys(req.files)[0]])
  // console.log(base64_encode(req.body.file))
  // console.log(req.files)
});

// multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(__dirname, "uploads"));
  },
  filename: (rwq, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/upload", upload.single("file"), (req, res, next) => {
  console.log(req.file);

  const file = req.file;
  res.send(file);
});

router.post("/auth", (req, res) => {
  let user = req.body;
  if (
    user.email === "digiminer99@gmail.com" &&
    user.password === "digi@miner321"
  ) {
    res.send({ message: "ok", status: 1 });
  } else {
    res.send({ message: "Not Valid", status: 0 });
  }
});

async function SendMailTo(attachment, email, res) {
  // console.log(attachment.toString('base64'))
  attach = await attachment
    .toString("base64")
    .replace(
      "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
      ""
    );
  const msg = await {
    to: email,
    from: "digiminer99@yandex.com",
    subject: "Digi Owner",
    text: "testing by sending attachment ",
    attachments: [
      {
        content: attach,
        filename: "attachment.xlxs",
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        disposition: "attachment",
      },
    ],

    html: "<strong>version 1</strong>",
  };
  // console.log(msg.attachments)
  sgMail.send(msg, (err, result) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
}
module.exports = router;
