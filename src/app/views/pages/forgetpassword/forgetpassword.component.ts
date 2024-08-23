import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/authservice/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss'],
  providers: [AuthService],
})
export class ForgetpasswordComponent implements OnInit {
  resetpasswordform: FormGroup;
  bigginLoad = false;
  erreur = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.resetpasswordform = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    // Vous pouvez toujours redéfinir le groupe ici si nécessaire
    this.resetpasswordform = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });
  }

  reset(): void {
    this.bigginLoad = true;
    if (this.resetpasswordform.valid) {
      const email = this.resetpasswordform.get('email')?.value;
      this.authService.resetpassword(email).subscribe(
        (response) => {
          this.toastr.success(response.message);
          this.bigginLoad = false;
          this.erreur = false;
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.bigginLoad = false;
        }
      );
    } else {
      this.erreur = true;
      this.bigginLoad = false;
    }
  }
}
