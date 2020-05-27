import { AuthService } from "./../Services/auth.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  authGroup: FormGroup;
  message: string;
  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authGroup = this.builder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.authGroup.valid) {
      this.authService.verifyUser(this.authGroup).subscribe((res) => {
        console.log(res.status);
        if (res.status) {
          console.log(res.message);
          this.router.navigate([""]);
          localStorage.setItem("isLogin", "true");
        } else {
          this.message = "invalid Id  or password";
        }
      });
    } else return;
  }
}
