const mongoose = require("mongoose");
// const ExcelDataSchema = mongoose.Schema({
//   "Photo link": {
//     type: String,
//     required: false,
//   },
//   Photos: {
//     type: String,
//     required: false,
//   },
//   "Posted date": {
//     type: String,
//     required: false,
//   },
//   Price: {
//     type: String,
//     required: false,
//   },
//   "Property type": {
//     type: String,
//     required: false,
//   },
//   size: {
//     type: String,
//     required: false,
//   },
//   "Card Summary Link_link": {
//     type: String,
//     required: false,
//   },
//   Description: {
//     type: String,
//     required: false,
//   },
//   "Owner/ Agent": {
//     type: String,
//     required: false,
//   },
//   Name: {
//     type: String,
//     required: false,
//   },
//   _url_input: {
//     type: String,
//     required: false,
//   },
//   "Uploaded date": {
//     type: String,
//     required: false,
//   },
// });

const ExcelDataSchema = mongoose.Schema({
  City: {
    type: String,
    required: false,
  },
  Locality: {
    type: String,
    required: false,
  },
  Property_type: {
    type: String,
    required: false,
  },
  "Property_type-link": {
    type: String,
    required: false,
  },
  Area: {
    type: String,
    required: false,
  },
  Rent: {
    type: String,
    required: false,
  },
  "Posted _by": {
    type: String,
    required: false,
  },
  Bedroom: {
    type: String,
    required: false,
  },
  Bathroom: {
    type: String,
    required: false,
  },
  "Owner/Agent _Name": {
    type: String,
    required: false,
  },
  Contact_Info: {
    type: String,
    required: false,
  },

  Posseion: {
    type: String,
    required: false,
  },
  Furnished: {
    type: String,
    required: false,
  },
  Facing: {
    type: String,
    required: false,
  },
  Floor: {
    type: String,
    required: false,
  },
  Age: {
    type: String,
    required: false,
  },
  Amentites: {
    type: String,
    required: false,
  },
    "Uploaded date": {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("excelData", ExcelDataSchema);
