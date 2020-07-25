const ExcelData = require("../models/ExcelData.model");
module.exports = {
  getAllData(req, res, next) {
    ExcelData.find({}, { _id: 0 })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  create(req, res, next) {
    const body = req.body;
    // const schema = new ExcelData({
    //   "Photo link": req.body["Photo link"],
    //   Photos: req.body.Photos,
    //   "Posted date": req.body["Posted date"],
    //   Price: req.body.Price,
    //   "Property type": req.body["Property type"],
    //   size: req.body.size,
    //   "Card Summary Link_link": req.body["Card Summary Link_link"],
    //   Description: req.body.Description,
    //   "Owner/ Agent": req.body["Owner/ Agent"],
    //   Name: req.body.Name,
    //   _url_input: req.body._url_input,
    //   "Uploaded date": req.body["Uploaded date"],
    // });

    ExcelData.create(body)
      .then((result) =>
        res.send({
          result: result._id,
          message: "added successfully",
        })
      )
      .catch((err) => res.status(500).json(err));
  },
};