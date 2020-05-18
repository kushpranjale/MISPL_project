import { ExcelData } from "./../models/excel-data";
import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { FormGroup } from "@angular/forms";
import { tap } from "rxjs/operators";
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
}
