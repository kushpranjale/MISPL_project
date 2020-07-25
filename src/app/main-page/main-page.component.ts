import { async } from "@angular/core/testing";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { renderFlagCheckIfStmt } from "@angular/compiler/src/render3/view/template";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
  teamInitial;
  filterGroup: FormGroup;
  mail: Boolean;
  mailGroup: FormGroup;
  minDate;
  minDateUp;
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
      lRange: 25000,
    },
  ];
  size: SizeRange[] = [
    {
      range: "<1000",
      hRange: 1000,
      lRange: 0,
    },
    {
      range: "1000 - 1500",
      hRange: 1500,
      lRange: 1000,
    },
    {
      range: "1500-2000",
      hRange: 2000,
      lRange: 1500,
    },
    {
      range: "2000-2500",
      hRange: 2500,
      lRange: 2000,
    },
    {
      range: "2500-3000",
      hRange: 3000,
      lRange: 2500,
    },
  ];

  posted_by = ["Owner", "Agent"];
  property_type = ["1 BHK", "2 BHK", "3 BHK"];
  bedroom = [1, 2, 3];
  bathroom = [1, 2, 3];
  file: File;
  arrayBuffer: any;
  fileName: string;
  filelist: any;
  data: ExcelData[] = [];
  filterData: ExcelData[] = [];
  send_status = false;
  // displayedColumns: string[] = [
  //   "Sr No.",
  //   "Photo link",
  //   "Photos",
  //   "Posted date",
  //   "Price",
  //   "Property type",
  //   "size",
  //   "Card Summary Link_link",
  //   "Description",
  //   "Owner/ Agent",
  //   "Name",
  //   "_url_input",
  //   "Uploaded date",
  // ];
  displayedColumns: string[] = [
    "Sr No.",
    "City",
    "Locality",
    "Property_type",
    "Property_type-link",
    "Area",
    "Rent",
    "Posted _by",
    "Bedroom",
    "Bathroom",
    "Owner/Agent _Name",
    "Contact_Info",
    "Posseion",
    "Furnished",
    "Facing",
    "Floor",
    "Age",
    "Amentites",
    "Uploaded date",
  ];
  // dataSource: any;
  dataSource = new MatTableDataSource<ExcelData>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private excelDataService: ExcelDataService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private routes: Router
  ) {}

  ngOnInit() {
    var h = null;
    console.log(5 < h);

    this.mailGroup = this.formBuilder.group({
      mail: [null, [Validators.required]],
    });
    this.filterGroup = this.formBuilder.group({
      price_range: [null, []],
      size_range: [null, []],
      property_type: [null, []],
      posted_by: [null, []],
      bedroom: [null, []],
      bathroom: [null, []],
      uploaded_fromDate: [null, []],
      uploaded_toDate: [null, []],
    });

    this.filterGroup.get("uploaded_fromDate").valueChanges.subscribe(() => {
      this.minDateUp = this.filterGroup.get("uploaded_fromDate").value;
      this.filterGroup.get("uploaded_toDate").setValue("");
    });
    this.getData();
    this.excelDataService.listener().subscribe(() => {
      this.getData();
    });

    // this.progress_status = false;
  }

  getData() {
    this.send_status = true;
    this.excelDataService.getData().subscribe((res) => {
      this.dataSource = new MatTableDataSource<ExcelData>(res);
      this.dataSource.paginator = this.paginator;
      this.data = res;
      // console.log(this.data);

      this.filterData = res;
      this.send_status = false;
      this.snackBar.open("Data loaded successfully ", "OK", {
        duration: 2000,
      });
      // setTimeout(() => (this.dataSource.paginator = this.paginator));
    });
  }

  addfile(event) {
    this.send_status = true;
    console.log(event.target.files.length);
    var k;
    for (k = 0; k < event.target.files.length; k++) {
      this.fileName = event.target.files[k].name;

      this.file = event.target.files[k];

      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = async (e) => {
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

        console.log(this.data);

        this.progress_status = true;
        await this.excelDataService.addData(
          this.data,
          formatDate(new Date(), "yyyy/MM/dd", "en")
        );
        this.excelDataService.listener2().subscribe(() => {
          console.log(this.excelDataService.status);
          this.send_status = this.excelDataService.status;
          this.snackBar.open("Uploaded Successfully...", "OK", {
            duration: 2000,
          });
        });

        this.progress_status = false;
      };
      console.log(this.file);
    }
  }
  exportAsExcelFile(mail: Boolean): void {
    this.send_status = true;
    this.mail = mail;
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
    this.saveAsExcelFile(excelBuffer, "ExcelData" + new Date().getTime());
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE,
    });

    if (this.mail) {
      FileSaver.saveAs(data, fileName + "_export_" + this.EXCEL_EXTENSION);
      this.send_status = false;
    }
    if (this.mailGroup.valid) {
      // FileSaver.saveAs(data, fileName + "_export_" + this.EXCEL_EXTENSION);
      // var myFile = this.blobToFile(
      //   data,
      //   fileName + "_export_" + this.EXCEL_EXTENSION
      // );
      var myFile = new File(
        [data],
        fileName + "_export_" + this.EXCEL_EXTENSION,
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          lastModified: Date.now(),
        }
      );
      let formData = new FormData();
      formData.append("email", this.mailGroup.get("mail").value);
      formData.append("file", myFile);
      formData.forEach((value, key) => {
        console.log(key + " " + value);
      });

      this.excelDataService.sendMail(formData).subscribe((res) => {
        this.send_status = false;
        this.snackBar.open("File Sent ...", "OK", {
          duration: 2000,
        });
        this.mailGroup.get("mail").setValue(null);
      });
    }
  }
  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };

  filter() {
    this.send_status = true;
    console.log(this.filterGroup.value);

    this.filterData = this.data;

    console.log(this.filterData);

    if (!this.filterGroup.get("uploaded_toDate").value) {
      this.filterGroup
        .get("uploaded_toDate")
        .setValue(this.filterGroup.get("uploaded_fromDate").value);
      console.log(this.filterGroup.get("uploaded_toDate").value);
    }
    this.filterData = this.filterData
      .filter((v) => {
        if (this.filterGroup.get("price_range").value) {
          return (
            +v.Rent <= this.filterGroup.value.price_range.hRange &&
            +v.Rent >= this.filterGroup.value.price_range.lRange
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("size_range").value) {
          return (
            +v.Area <= this.filterGroup.value.size_range.hRange &&
            +v.Area >= this.filterGroup.value.size_range.lRange
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("posted_by").value) {
          return (
            v["Posted _by"].toLowerCase().trim() ==
            this.filterGroup.get("posted_by").value.toLowerCase().trim()
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("property_type").value && v.Property_type) {
          return (
            this.filterGroup.value.property_type.replace(/[ , ]/g, "") ==
            v.Property_type.replace(/[ , ]/g, "")
          );
        } else {
          return this.filterData;
        }
      })
      .filter((v) => {
        if (this.filterGroup.get("bedroom").value && v.Bedroom) {
          return (
            this.filterGroup.value.bedroom ==
            +v.Bedroom.replace(/[ , Bedroom,Bedrooms]/g, "")
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("bathroom").value && v.Bathroom) {
          console.log(this.filterGroup.get("bathroom").value);

          return (
            this.filterGroup.get("bathroom").value ===
            +v.Bathroom.replace(/[ , Bathroom, Bathrooms,ed]/g, "").trim()
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("uploaded_fromDate").value) {
          console.log(this.filterGroup.get("uploaded_fromDate").value);

          return (
            new Date(v["Uploaded date"]).getTime() >=
              new Date(this.filterGroup.value.uploaded_fromDate).getTime() &&
            new Date(v["Uploaded date"]).getTime() <=
              new Date(this.filterGroup.value.uploaded_toDate).getTime()
          );
        } else return this.filterData;
      });
    console.log(this.filterData);

    this.dataSource = new MatTableDataSource<ExcelData>(this.filterData);
    this.dataSource.paginator = this.paginator;
    this.send_status = false;
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
    this.filterGroup.reset();
    this.filterData = this.data;
    this.dataSource = new MatTableDataSource<ExcelData>(this.data);
    this.dataSource.paginator = this.paginator;
  }
  logout() {
    localStorage.removeItem("isLogin");
    this.routes.navigate(["login"]);
  }
}
interface PriceRange {
  range: string;
  hRange: number;
  lRange: number;
}
interface SizeRange {
  range: string;
  hRange: number;
  lRange: number;
}
