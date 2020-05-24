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
  url = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) {}
  listener() {
    return this.updatedData.asObservable();
  }

  addData(obj: ExcelData[], date: string) {
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
        .post(`${this.url}add_excel`, data)
        .pipe(
          tap(() => {
            this.updatedData.next();
          })
        )
        .subscribe();
    });
  }
  getData(): Observable<ExcelData[]> {
    return this.httpClient.get<ExcelData[]>(`${this.url}excel_data`);
  }
  sendMail(user: {}) {
    this.httpClient
      .post("http://localhost:8080/api/sendMail", user)
      .subscribe();
  }
  uploadFile(file: FormData) {
    this.httpClient.post("http://localhost:8080/api/upload", file).subscribe();
  }
}
