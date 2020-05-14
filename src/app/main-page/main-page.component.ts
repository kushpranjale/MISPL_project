import { ExcelDataService } from "./../Services/excel-data.service";
import { ExcelData } from "./../models/excel-data";
import { Component, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
  progress_status = false;
  priceRange: PriceRange[] = [
    {
      range: "<10000",
      hRange: 10000,
      lRange: 0,
    },
    {
      range: "10000 - 15000",
      hRange: 15000,
      lRange: 10000,
    },
    {
      range: "15000-20000",
      hRange: 20000,
      lRange: 15000,
    },
    {
      range: "20000-25000",
      hRange: 25000,
      lRange: 20000,
    },
    {
      range: "25000-30000",
      hRange: 30000,
      lRange: 55000,
    },
  ];
  file: File;
  arrayBuffer: any;
  fileName: string;
  filelist: any;
  data: ExcelData[] = [];
  filterData: ExcelData[] = [];
  displayedColumns: string[] = [
    "Photo link",
    "Photos",
    "Posted date",
    "Price",
    "Property type",
    "size",
    "Card Summary Link_link",
    "Description",
    "Owner/ Agent",
    "Name",
    "_url_input",
  ];
  // dataSource: any;
  dataSource: MatTableDataSource<ExcelData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit() {}

  addfile(event) {
    this.progress_status = true;
    console.log(event.target.files[0].name);
    this.fileName = event.target.files[0].name;

    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = arraylist;
      this.data = this.filelist;
      console.log(this.filelist);
      // this.dataSource = this.filelist;
      this.dataSource = new MatTableDataSource<ExcelData>(this.data);
      // this.data.push(this.filelist);
      // this.data.map((value, index, arr) => {
      //   console.log(arr);
      // });
      // this.dataSource.paginator = this.paginator;
      setTimeout(() => (this.dataSource.paginator = this.paginator));

      console.log(this.data);

      // this.data.map((value: ExcelData) => {
      //   console.log(+value.Price.replace(/[,₹ ]/g, ""));
      // });
      this.excelDataService.addData(this.data);
      this.progress_status = false;
    };
  }
  filter(hRange, lRange) {
    console.log(hRange, lRange);
    this.filterData = this.data.filter(
      (v) =>
        +v.Price.replace(/[,₹ ]/g, "") < hRange &&
        +v.Price.replace(/[,₹ ]/g, "") > lRange
    );
    this.dataSource = new MatTableDataSource<ExcelData>(this.filterData);
  }
}
interface PriceRange {
  range: string;
  hRange: number;
  lRange: number;
}
