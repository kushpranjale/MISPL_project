import { ExcelDataService } from "./../Services/excel-data.service";
import { ExcelData } from "./../models/excel-data";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
  teamInitial;
  EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  EXCEL_EXTENSION = ".xlsx";
  progress_status = false;
  // progress_for_downloading = false
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
    "Sr No.",
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
  dataSource = new MatTableDataSource<ExcelData>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private excelDataService: ExcelDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getData();
    this.excelDataService.listener().subscribe(() => {
      this.getData();
      this.progress_status = false;
    });
    this.snackBar.open("Data loaded successfully ", "OK", {
      duration: 2000,
    });
    this.progress_status = false;
  }

  getData() {
    this.progress_status = true;
    this.excelDataService.getData().subscribe((res) => {
      this.dataSource = new MatTableDataSource<ExcelData>(res);
      this.dataSource.paginator = this.paginator;
      this.data = res;
      this.filterData = res;
      // setTimeout(() => (this.dataSource.paginator = this.paginator));
    });
  }

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
      // this.dataSource = new MatTableDataSource<ExcelData>(this.data);
      // this.data.push(this.filelist);
      // this.data.map((value, index, arr) => {
      //   console.log(arr);
      // });
      // this.dataSource.paginator = this.paginator;
      // setTimeout(() => (this.dataSource.paginator = this.paginator));

      console.log(this.data);

      // this.data.map((value: ExcelData) => {
      //   console.log(+value.Price.replace(/[,₹ ]/g, ""));
      // });
      this.excelDataService.addData(this.data);
      this.progress_status = false;
    };
  }
  exportAsExcelFile(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterData);
    console.log("worksheet", worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, "downloadeFile");
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + this.EXCEL_EXTENSION
    );
  }

  filter(hRange, lRange) {
    console.log(hRange, lRange);
    this.filterData = this.data.filter(
      (v) =>
        +v.Price.replace(/[,₹ ]/g, "") < hRange &&
        +v.Price.replace(/[,₹ ]/g, "") > lRange
    );
    this.dataSource = new MatTableDataSource<ExcelData>(this.filterData);
    this.dataSource.paginator = this.paginator;
  }
  copyText(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.snackBar.open("Text copied!!!", "OK", {
      duration: 2000,
    });
  }
  reset() {
    this.teamInitial = "";
    this.filterData = this.data;
    this.dataSource = new MatTableDataSource<ExcelData>(this.data);
    this.dataSource.paginator = this.paginator;
  }
}
interface PriceRange {
  range: string;
  hRange: number;
  lRange: number;
}
