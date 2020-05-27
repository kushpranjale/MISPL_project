const ExcelDataController = require("./controller/ExcelData");
// const path = require ()
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const multer = require("multer");
router.get("/excel_data", ExcelDataController.getAllData);
router.post("/add_excel", ExcelDataController.create);

// NodeMailer
router.post("/sendMail", (req, res) => {
  let user = req.body;
  console.log(req.body);
  sendMail(user, (info) => {
    console.log("Done");
    res.send(info);
  });
});
async function sendMail(user, cb) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "digiminer99@gmail.com",
      pass: "digi@miner321",
    },
  });
  let mailOptions = {
    from: "test",
    to: user.email,
    subject: "test test",
    html: `Any thing you want`,

    attachments: [
      {
        filename: user.attachment,
        path: "./uploads/" + user.attachment,
      },
    ],
  };
  let info = await transporter.sendMail(mailOptions);
  cb(info);
}

// multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
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
module.exports = router;
