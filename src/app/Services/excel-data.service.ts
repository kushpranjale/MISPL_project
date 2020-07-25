import { async } from "@angular/core/testing";
import { url } from "./index";
import { ExcelData } from "./../models/excel-data";
import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { FormGroup } from "@angular/forms";
import { tap } from "rxjs/operators";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ExcelDataService {
  updatedData = new Subject();
  update = new Subject();
  status = false;

  // url = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) {}
  listener() {
    return this.updatedData.asObservable();
  }
  listener2() {
    return this.update.asObservable();
  }

  addData(obj: ExcelData[], date: string) {
    var count = 1;
    obj.forEach((data: ExcelData) => {
      if (((data["Posted date"] as unknown) as string) === "Yesterday") {
        let date = new Date();
        data["Posted date"] = formatDate(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "MMMM dd,yyyy",
          "en"
        );
      }
      if (((data["Posted date"] as unknown) as string) === "Today") {
        let date = formatDate(new Date(), "MMMM dd,yyyy", "en");

        data["Posted date"] = date;
      }
      data["Uploaded date"] = date;
      this.httpClient
        .post(`${url}add_excel`, data)
        .pipe(
          tap(() => {
            if (count === obj.length) {
              console.log("inside tap");

              this.updatedData.next();
            }
          })
        )
        .subscribe((res) => {
          count++;
          if (count === obj.length + 1) {
            this.update.next();
          }
        });
    });
  }
  getData(): Observable<ExcelData[]> {
    return this.httpClient.get<ExcelData[]>(`${url}excel_data`);
  }
  sendMail(user: FormData) {
    return this.httpClient.post(`${url}sendMail`, user);
  }
  uploadFile(file: FormData) {
    this.httpClient.post(`${url}upload`, file).subscribe();
  }
}
