const mongoose = require("mongoose");
const ExcelDataSchema = mongoose.Schema({
  "Photo link": {
    type: String,
    required: false,
  },
  Photos: {
    type: String,
    required: false,
  },
  "Posted date": {
    type: String,
    required: false,
  },
  Price: {
    type: String,
    required: false,
  },
  "Property type": {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  "Card Summary Link_link": {
    type: String,
    required: false,
  },
  Description: {
    type: String,
    required: false,
  },
  "Owner/ Agent": {
    type: String,
    required: false,
  },
  Name: {
    type: String,
    required: false,
  },
  _url_input: {
    type: String,
    required: false,
  },
  "Uploaded date": {
    type: String,
    required: false,
  },
});
module.exports = mongoose.model("excelData", ExcelDataSchema);
