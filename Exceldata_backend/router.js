const ExcelDataController = require("./controller/ExcelData");
// const path = require ()
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
router.get("/excel_data", ExcelDataController.getAllData);
router.post("/add_excel", ExcelDataController.create);
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
    attachments: user.attachment,
    // attachments: [
    //   {
    //     filename: user.attachment,
    //     path: "C:/Users/lav/Downloads/" + user.attachment,
    //   },
    // ],
  };
  let info = await transporter.sendMail(mailOptions);
  cb(info);
}
module.exports = router;
