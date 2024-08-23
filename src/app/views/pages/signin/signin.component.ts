import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/authservice/auth.service';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';

const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('.5s', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('.5s', style({ opacity: 0 }))]),
]);

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  animations: [fadeInOutAnimation],
  providers: [AuthService],
})
export class SigninComponent implements OnInit {
  formulaire!: FormGroup;
  erreurLogin = false;
  bigginLoad = false;
  responseError: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formulaire = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.customPasswordValidator,
        ],
      ],
      rememberme: [false],
    });
  }

  customPasswordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password: string = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasUppercase && hasSpecialChar && hasNumber
      ? null
      : { invalidPassword: true };
  }

  signin() {
    this.bigginLoad = true;
    if (this.formulaire.valid) {
      const username = this.formulaire.get('username')?.value;
      const password = this.formulaire.get('password')?.value;
      const rememberme = this.formulaire.get('rememberme')?.value;

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('rememberme', rememberme);

      this.authService.signin(formData).subscribe(
        (response) => {
          this.bigginLoad = false;
          this.erreurLogin = false;
          let destination = localStorage.getItem('destination');

          this.router.navigate(['/' + destination]);
          localStorage.removeItem('destination');
          localStorage.setItem('email', username);
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.bigginLoad = false;
        }
      );
    } else {
      this.erreurLogin = true;
      this.bigginLoad = false;
    }
  }

  reset_password() {
    this.router.navigate(['/resetpassword'])
  }
}
