const ExcelDataController = require("./controller/ExcelData");
const express = require("express");
const router = express.Router();
router.get("/excel_data", ExcelDataController.getAllData);
router.post("/add_excel", ExcelDataController.create);
module.exports = router;
