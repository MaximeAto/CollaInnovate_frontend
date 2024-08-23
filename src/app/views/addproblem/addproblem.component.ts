import { Component, OnInit } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { EditorModule } from 'primeng/editor';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ProblemService } from '../../services/problemService/problem.service';
import { ToastrService } from 'ngx-toastr';
import { ToastComponent } from '../../layout/toast/toast.component';
import { SidebarModule } from 'primeng/sidebar';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollerModule } from 'primeng/scroller';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-addproblem',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    ReactiveFormsModule,
    EditorModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    FilterPipeModule,
    ScrollerModule,
    SidebarModule,
  ],
  templateUrl: './addproblem.component.html',
  styleUrls: ['./addproblem.component.scss'],
  providers: [ProblemService],
})
export class AddproblemComponent implements OnInit {
  countries = [
    { name: 'Algérie', code: 'DZ' },
    { name: 'Angola', code: 'AO' },
    { name: 'Bénin', code: 'BJ' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cameroun', code: 'CM' },
    { name: 'Cap-Vert', code: 'CV' },
    { name: 'République centrafricaine', code: 'CF' },
    { name: 'Tchad', code: 'TD' },
    { name: 'Comores', code: 'KM' },
    { name: 'Congo (Brazzaville)', code: 'CG' },
    { name: 'Congo (Kinshasa)', code: 'CD' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Égypte', code: 'EG' },
    { name: 'Guinée équatoriale', code: 'GQ' },
    { name: 'Érythrée', code: 'ER' },
    { name: 'Éthiopie', code: 'ET' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambie', code: 'GM' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Guinée', code: 'GN' },
    { name: 'Guinée-Bissau', code: 'GW' },
    { name: "Côte d'Ivoire", code: 'CI' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libye', code: 'LY' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Mali', code: 'ML' },
    { name: 'Mauritanie', code: 'MR' },
    { name: 'Maurice', code: 'MU' },
    { name: 'Maroc', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Namibie', code: 'NA' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'Sao Tomé-et-Principe', code: 'ST' },
    { name: 'Sénégal', code: 'SN' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Somalie', code: 'SO' },
    { name: 'Afrique du Sud', code: 'ZA' },
    { name: 'Soudan du Sud', code: 'SS' },
    { name: 'Soudan', code: 'SD' },
    { name: 'Swaziland', code: 'SZ' },
    { name: 'Tanzanie', code: 'TZ' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tunisie', code: 'TN' },
    { name: 'Ouganda', code: 'UG' },
    { name: 'Zambie', code: 'ZM' },
    { name: 'Zimbabwe', code: 'ZW' },
  ];
  categories = [
    "Operations Management",
    "Finance",
    "Human Resources",
    "Marketing",
    "Sales",
    "Technology",
    "Product Development",
    "Customer Service",
    "Legal",
    "Strategic Planning",
    "R&D (Research and Development)",
    "Supply Chain Management",
    "Sustainability",
    "Health and Safety",
    "Customer Insights",
    "Public Relations",
    "Data Analysis",
    "Innovation Management",
    "Risk Management",
    "Project Management",
    "Corporate Governance",
    "Education and Training",
    "Facility Management",
    "Vendor Management"
  ]

  formulaire!: FormGroup;
  errorAdd: boolean = false;
  bigginLoad: boolean = false;
  error: string = 'ras';
  selectedCountry!: any;
  responseError: any;
  show = false;
  success = false;
  message: any;
  recommandation: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private problemServ: ProblemService,
  ) {}

  ngOnInit() {
    this.formulaire = this.formBuilder.group({
      business_needs_improvement: ['', Validators.required],
      population_affected: ['', Validators.required],
      concern_population_affected: ['', Validators.required],
      impacts_on_these_populations: ['', Validators.required],
      population_volume: ['', Validators.required],
      problemTitle: ['', Validators.required],
      aboutProblem: ['', Validators.required],
      category: ['', Validators.required],
      country: ['', Validators.required],
      deadline: ['', Validators.required],
      city: ['', Validators.required],
    });
  }



  save() {
    this.errorAdd = false;
    if (this.formulaire.valid) {
      this.bigginLoad = true;
      const formData = this.formulaire.value;
      let email = localStorage.getItem("email")

      this.problemServ.addproblem(formData,email).subscribe(
        (response) => {
          this.bigginLoad = false;
          this.showToast(response.message, true) 
          setTimeout(() => {
            this.recommandation = true
          }, 2000);
        },
        (error) => {
          this.responseError = (error as HttpErrorResponse).error.message;
          this.showToast(this.responseError, false) 
          this.errorAdd = true;
          this.bigginLoad = false;
        }
      );
    } else {
      this.errorAdd = true;
      this.error = 'yes';
      console.log('Form is invalid');

      // Log errors for each control
      Object.keys(this.formulaire.controls).forEach((key) => {
        const controlErrors = this.formulaire.get(key)?.errors;
        if (controlErrors) {
          console.log(`${key} errors: `, controlErrors);
        }
      });

      this.scrollToFirstInvalidControl();
    }
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement | null =
      document.querySelector('.is-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstInvalidControl.focus();
    }
  }

  resetForm() {
    this.formulaire.reset();
    this.errorAdd = false;
    this.error = 'ras';
  }

  showToast(message: string, success:boolean) {
    this.message = message;
    this.show = true;
    this.success = success
    setTimeout(() => this.hide(), 5000);
  }

  hide() {
    this.show = false;
  }
}
