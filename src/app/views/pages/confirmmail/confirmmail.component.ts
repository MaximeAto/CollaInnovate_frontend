import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authservice/auth.service';
import { ToastrService } from 'ngx-toastr';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-confirmmail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    InputOtpModule,
  ],
  templateUrl: './confirmmail.component.html',
  providers: [AuthService],
  styleUrl: './confirmmail.component.scss',
})
export class ConfirmmailComponent implements OnInit {

  verificationForm!: FormGroup;
  bigginLoad: boolean = false;
  responseError: any;
  verified = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      verificationCode: ['', [Validators.required]],
    });
  }
  verify() {
    if (this.verificationForm.valid) {
      let verificationCode =
        this.verificationForm.get('verificationCode')!.value;
      let email = localStorage.getItem('email');

      this.authService.verifyemail(verificationCode, email).subscribe(
        (response) => {
          this.verified = true;
          let destination = localStorage.getItem('destination');
          this.bigginLoad = false;
          this.toastr.success(response.message);
          setTimeout(() => {
            this.router.navigate(['/' + destination]);
          }, 5000);
          localStorage.removeItem('destination')
        },
        (error) => {
          this.toastr.error(error.error.message);
          console.log(error);
          
          this.bigginLoad = false;
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  ressendCode() {
    let email = localStorage.getItem('email');
    this.authService.resendCodePing(email).subscribe(
      (response) => {
        setTimeout(() => {
          this.toastr.success('New ping code have been send');
        }, 1500);
        this.verificationForm.reset()
      },
      (error) => {
        this.toastr.error("error");
      }
    )
  }
}
