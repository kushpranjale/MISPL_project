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

  sizeRange: SizeRange[] = [
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
    "Uploaded date",
  ];
  // dataSource: any;
  dataSource = new MatTableDataSource<ExcelData>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private excelDataService: ExcelDataService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
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
      posted_by: [null, []],
      posted_fromDate: [null, []],
      posted_toDate: [null, []],
      uploaded_fromDate: [null, []],
      uploaded_toDate: [null, []],
    });
    this.filterGroup.get("posted_fromDate").valueChanges.subscribe(() => {
      this.minDate = this.filterGroup.get("posted_fromDate").value;
      this.filterGroup.get("posted_toDate").setValue("");
    });
    this.filterGroup.get("uploaded_fromDate").valueChanges.subscribe(() => {
      this.minDateUp = this.filterGroup.get("uploaded_fromDate").value;
      this.filterGroup.get("uploaded_toDate").setValue("");
    });
    this.getData();
    this.excelDataService.listener().subscribe(() => {
      this.getData();
    });
    this.snackBar.open("Data loaded successfully ", "OK", {
      duration: 2000,
    });
    // this.progress_status = false;
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
    this.progress_status = false;
  }

  addfile(event) {
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
      this.progress_status = true;
      this.excelDataService.addData(
        this.data,
        formatDate(new Date(), "yyyy/MM/dd", "en")
      );
      this.progress_status = false;
    };
    console.log(this.file);
  }
  exportAsExcelFile(mail: Boolean): void {
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

    if (this.mail)
      FileSaver.saveAs(data, fileName + "_export_" + this.EXCEL_EXTENSION);
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
      const formData = new FormData();
      formData.append("file", myFile);
      console.log(myFile);

      this.excelDataService.uploadFile(formData);

      // var reader = new FileReader();
      // reader.readAsDataURL(myFile);
      // var fileToSend: any;
      // reader.onload = () => {
      //   fileToSend = reader.result;
      //   var user = {
      //     email: this.mailGroup.get("mail").value,
      //     name: "kush",
      //     attachment: fileToSend,
      //   };
      //   this.excelDataService.sendMail(user);
      // };
      var user = {
        email: this.mailGroup.get("mail").value,
        name: "kush",
        attachment: fileName + "_export_" + this.EXCEL_EXTENSION,
      };
      this.excelDataService.sendMail(user);
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
    this.filterData = this.data;
    if (!this.filterGroup.get("posted_toDate").value) {
      this.filterGroup
        .get("posted_toDate")
        .setValue(this.filterGroup.get("posted_fromDate").value);
    }
    if (!this.filterGroup.get("uploaded_toDate").value) {
      this.filterGroup
        .get("uploaded_toDate")
        .setValue(this.filterGroup.get("uploaded_fromDate").value);
      console.log(this.filterGroup.get("uploaded_toDate").value);
    }

    this.filterData = this.filterData
      .filter((v) => {
        console.log("inside if");
        if (this.filterGroup.get("price_range").value) {
          return (
            +v.Price.replace(/[,₹ ]/g, "") <=
              this.filterGroup.value.price_range.hRange &&
            +v.Price.replace(/[,₹ ]/g, "") >=
              this.filterGroup.value.price_range.lRange
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("size_range").value) {
          return (
            +v.size.replace(/[sqft, ]/g, "") <=
              this.filterGroup.value.size_range.hRange &&
            +v.size.replace(/[sqft, ]/g, "") >=
              this.filterGroup.value.size_range.lRange
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("posted_by").value) {
          return v["Owner/ Agent"] == this.filterGroup.get("posted_by").value;
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("uploaded_fromDate").value) {
          return (
            new Date(v["Uploaded date"]) >=
              this.filterGroup.get("uploaded_fromDate").value &&
            new Date(v["Uploaded date"]) <=
              this.filterGroup.get("uploaded_toDate").value
          );
        } else return this.filterData;
      })
      .filter((v) => {
        if (this.filterGroup.get("posted_fromDate").value) {
          return (
            new Date(v["Posted date"]) >=
              this.filterGroup.get("posted_fromDate").value &&
            new Date(v["Posted date"]) <=
              this.filterGroup.get("posted_toDate").value
          );
        } else return this.filterData;
      });
    //   For All
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   console.log("inside all");

    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }
    // only for posted date
    // if (
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value
    // ) {
    //   this.filterData = this.filterData.filter((v) => {
    //     console.log("inside");
    //     return (
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //     );
    //   });
    // }
    // console.log(this.data);

    // // Only for uploaded date
    // if (
    //   this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value
    // ) {
    //   this.filterData = this.filterData.filter((v) => {
    //     return (
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //     );
    //   });
    // }
    // //  Only for price
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange
    //   );
    // }

    // // Only for size
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange
    //   );
    // }
    // // only for posted by
    // if (
    //   this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) => v["Owner/ Agent"] == this.filterGroup.get("posted_by").value
    //   );
    // }

    // //  for price and size
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange
    //   );
    // }

    // // For price and posted by
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value
    //   );
    // }
    // // For size and posted by
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value &&
    //   !this.filterGroup.get("posted_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value
    //   );
    // }

    // // For price and posted Date
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // For Price and uploaded date
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //   );
    // }
    // // For Size and posted date
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }
    // // For Size and uploaded date
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //   );
    // }

    // // For posted by and posted date
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // For Posted by and Uploaded date
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //   );
    // }
    // // For Upload Date and Posted Date
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // Price & Size & Posted By
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value
    //   );
    // }

    // //  Price & Size & Posted Date
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // Price & Size & Uploaded Date

    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //   );
    // }

    // // Price & Posted By & Posted Date

    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // Price & Posted By & Upload Date
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //   );
    // }

    // //  Price Posted Date Upload Date

    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // //  Size PostedBy PostedDate
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // Size PostedDate UpdateDate
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // PostedBy UploadeDate PostedDate

    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }
    // // Price is missing
    // if (
    //   !this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }
    // //  Size is missing
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   !this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

    // // PostedBy is missing
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   !this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }
    // // PostedDate is missing
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   !this.filterGroup.get("posted_fromDate").value &&
    //   this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Uploaded date"]) >=
    //         this.filterGroup.get("uploaded_fromDate").value &&
    //       new Date(v["Uploaded date"]) <=
    //         this.filterGroup.get("uploaded_toDate").value
    //   );
    // }
    // // Uploaded is missing
    // if (
    //   this.filterGroup.get("price_range").value &&
    //   this.filterGroup.get("size_range").value &&
    //   this.filterGroup.get("posted_by").value &&
    //   this.filterGroup.get("posted_fromDate").value &&
    //   !this.filterGroup.get("uploaded_fromDate").value
    // ) {
    //   this.filterData = this.filterData.filter(
    //     (v) =>
    //       +v.Price.replace(/[,₹ ]/g, "") <=
    //         this.filterGroup.value.price_range.hRange &&
    //       +v.Price.replace(/[,₹ ]/g, "") >=
    //         this.filterGroup.value.price_range.lRange &&
    //       +v.size.replace(/[sqft, ]/g, "") <=
    //         this.filterGroup.value.size_range.hRange &&
    //       +v.size.replace(/[sqft, ]/g, "") >=
    //         this.filterGroup.value.size_range.lRange &&
    //       v["Owner/ Agent"] == this.filterGroup.get("posted_by").value &&
    //       new Date(v["Posted date"]) >=
    //         this.filterGroup.get("posted_fromDate").value &&
    //       new Date(v["Posted date"]) <=
    //         this.filterGroup.get("posted_toDate").value
    //   );
    // }

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
    this.filterGroup.reset();
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
interface SizeRange {
  range: string;
  hRange: number;
  lRange: number;
}
