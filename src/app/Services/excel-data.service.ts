import { ExcelData } from "./../models/excel-data";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
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

  addData(obj: ExcelData[]) {
    // const data = {
    //   emp_id: formData.value.emp_id,
    //   name: formData.value.name,
    //   email: formData.value.email,
    //   phone: formData.value.phone,
    //   address: formData.value.address,
    //   dob: formData.value.dob,
    //   createdDate: new Date(),
    //   isActive: formData.value.isActive,
    // };
    obj.forEach((data: ExcelData) => {
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
}
