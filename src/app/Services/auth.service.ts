import { url } from "./index";
import { Routes, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  verifyUser(data: FormGroup) {
    const users = {
      email: data.value.email,
      password: data.value.password,
    };
    return this.httpClient.post<{ message: string; status: number }>(
      `${url}auth`,
      users
    );
  }
}
