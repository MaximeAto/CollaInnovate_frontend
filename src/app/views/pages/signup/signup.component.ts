import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authservice/auth.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastrService} from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('2s', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('.5s', style({ opacity: 0 }))]),
]);

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [AuthService],
  animations: [fadeInOutAnimation],
})


export class SignupComponent implements OnInit {
  responseError: any;
  formulaire!: FormGroup;
  erreurLogin = false;
  bigginLoad= false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formulaire = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        fullname: ['', [Validators.required, Validators.minLength(3)]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            ),
          ],
        ],
        phone_number: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.customPasswordValidator,
          ],
        ],
        repassword: ['', Validators.required],
        termsofuse: [false, Validators.requiredTrue],
      },
      { validator: this.passwordMatchValidator.bind(this) }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const repassword = form.get('repassword');
    
    if (!password || !repassword) {
      return null;
    }
  
    const mismatch = password.value !== repassword.value;
    if (mismatch) {
      repassword.setErrors({ mismatch: true });
    } else {
      repassword.setErrors(null); // Clear any previous error
    }
    
    return mismatch ? { mismatch: true } : null;
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

  signup() {
    this.bigginLoad = true
    if (this.formulaire.valid) {
      const username = this.formulaire.get('username')?.value;
      const fullname = this.formulaire.get('fullname')?.value;
      const email = this.formulaire.get('email')?.value;
      const phone_number = this.formulaire.get('phone_number')?.value;
      const password = this.formulaire.get('password')?.value;
      const repassword = this.formulaire.get('repassword')?.value;
      const termsofuse = this.formulaire.get('termsofuse')?.value;

      // Vérifiez si le mot de passe et la confirmation du mot de passe correspondent
      if (password != repassword) {
        this.erreurLogin = false;
        console.error('Les mots de passe ne correspondent pas.');
        return;
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('full_name', fullname);
      formData.append('email', email);
      formData.append('phone_number', phone_number);
      formData.append('password', password);
      formData.append('termsofuse', termsofuse.toString());

      // Soumettez les données au serveur ou effectuez d'autres actions nécessaires
      // Exemple : appel à un service d'inscription
      this.authService.signup(formData).subscribe(
        (response) => {
          this.erreurLogin = false;
          this.bigginLoad = false;
          console.log(response.token, response.ping );
          localStorage.setItem("email",response.email)
          localStorage.setItem("username",response.username)
          this.router.navigate(['/'+ "confirmmail"]);
        },
        (error) => {
          this.responseError = (error as HttpErrorResponse).error.message;
          this.toastr.error(this.responseError);
          this.bigginLoad = false;
          this.erreurLogin = true;
        }
      );

    }else{
    this.bigginLoad = false
    this.erreurLogin = true
    }
  }
}
