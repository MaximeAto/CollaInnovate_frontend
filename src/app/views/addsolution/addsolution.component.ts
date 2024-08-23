import { Component, OnInit } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ProblemService } from '../../services/problemService/problem.service'; // Adjust the path if necessary
import { ToastrService } from 'ngx-toastr'; // If you are using Toastr for notifications
import { SolutionService } from '../../services/solutionService/solution.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-addsolution',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    EditorModule,
    ScrollerModule,
    SidebarModule,
    TableModule,
  ],
  templateUrl: './addsolution.component.html',
  styleUrls: ['./addsolution.component.scss'],
  providers: [SolutionService,ProblemService],
})
export class AddsolutionComponent implements OnInit {
  more = "Click to add more information"
  formulaire!: FormGroup;
  erreurLogin: boolean = false;
  bigginLoad: boolean = false;
  error: string = 'ras';
  responseError: any;
  show = false;
  success = false;
  message: any;
  lookmore = false;
  financingPhase = [
    {"name":"Early stage"},
    {"name":"Seed phase"},
    {"name":"Start-up phase"},
    {"name":"Expansion phase"},
    {"name":"Growth phase"},
    {"name":"Transit phase"},
    {"name":"Later phase"},
    {"name":"Other"},
  ]
  problem:any;
  problemID:any;
  recommandation: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private solutionServ: SolutionService,
    private route : ActivatedRoute, 
    private problemService: ProblemService,
  ) {}

  ngOnInit() {
    this.loadFormulaire()
    this.route.paramMap.subscribe(params => {
      this.problemID = params.get('problem');
      this.loadProblemInfo(this.problemID)
    });
  }

  loadProblemInfo(id:any){
    this.problemService.getProblemById(id).subscribe(
      (value) => {
        this.problem = value.message
        console.log(this.problem);
      },
      error => {
        
      }
    )
  }

  loadFormulaire(){
    this.formulaire = this.formBuilder.group({
      solutionTitle: ['', Validators.required],
      aboutSolution: ['', Validators.required],
      productsOnOffer: [''],
      servicesOnOffer: [''],
      customerExpectations: [''],
      how_product_service_marketed: [''],
      customer_access_method: [''],
      companySales: [''],
      directSales: [false],
      retailSales: [false],
      wholesale: [false],
      informalSales: [false],

      advertising: [false],
      directMarketing: [false],
      salesPromotion: [false],
      display: [false],
      wordOfMouth: [false],
      tradeShow: [false],
      mailOrder: [false],

      competitors: this.formBuilder.array([this.createCompetitor()]),
      humans: this.formBuilder.array([this.createHuman()]),
      
      legalForm: [''],
      
      investment: this.formBuilder.group({
        needs: [''],
        characteristics: [''],
        suppliers: this.formBuilder.array([this.createSupplier()]),
      }),
      fixedcosts: this.formBuilder.array([this.createFixedCost()]),
      variablecosts: this.formBuilder.array([this.createVariableCost()]),
      financialforecast: this.formBuilder.group({
        quantitysold: [''],
        salesgenerated: this.formBuilder.group({
          firstmonth: [''],
          thirdmonth: [''],
          sixthmonth: [''],
          firstyear: [''],
          thirdyear: [''],
        }),
        offers: this.formBuilder.array([this.createOffers()]),
      }),
      financingNeed : [''],
      cashflowthirdyear : [''],
      cashflowfirstyear : [''],
      cashflowsixthmonth : [''],
      cashflowthirdmonth : [''],
      cashflowfirstmonth : [''],
      financingPhase : [''],
      financingSource : this.formBuilder.group({
        equitycapital : this.formBuilder.group({
          privatesavings: [false],
          privatesphere: [false],
          privateshareholders: [false],
          startupsponsors: [false],
          businessagents: [false],
          incubatorandbusinessincubator: [false],
          mixedcapital: [false],
        }),
        creditsource : this.formBuilder.group({
          bankCredit: [false],
          startupLaunchCredit: [false],
          mezzanineFinancing: [false],
          other: [false],
        }),
        publicSubsidyforBusinessCreation : this.formBuilder.group({
          businessstartupprogram: [false],
          startupCompetition: [false],
          other: [false]
        }),
        crowdfundingSources: this.formBuilder.group({
          crowdfunding: [false],
          crowdInvesting: [false],
          crowdLending: [false],
          other: [false],
        }),
      }),
      remunerationType : [''],
      pillar : [''],
    });
  }

  save() {
    this.erreurLogin = false;
    if (this.formulaire.valid) {
      this.bigginLoad = true;
      const formData = this.formulaire.value;
      console.log('Form Data:', formData);
      let email = localStorage.getItem('email');

      this.solutionServ.addsolution(formData, email,this.problemID).subscribe(
        (response: any) => {
          this.bigginLoad = false;
          this.showToast(response.message, true);
          setTimeout(() => {
            this.recommandation = true
          }, 2000);
        },
        (e: any) => {
          this.showToast(e.error.message, false);
          this.erreurLogin = true;
          this.bigginLoad = false;
        }
      );
    } else {
      this.erreurLogin = true;
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
    this.erreurLogin = false;
    this.error = 'ras';
  }

  showToast(message: string, success: boolean) {
    this.message = message;
    this.show = true;
    this.success = success;
    setTimeout(() => this.hide(), 5000);
  }

  hide() {
    this.show = false;
  }

  showmore() {
    this.lookmore = !this.lookmore;
    if(this.more != "Click to close")
      this.more = "Click to close"
    else
      this.more = "Click to add more information "

  }

  createCompetitor(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      strength: [''],
      weakness: [''],
    });
  }

  addCompetitor() {
    (this.formulaire.get('competitors') as FormArray).push(
      this.createCompetitor()
    );
  }

  getCompetitorsFormArray(): FormArray {
    return this.formulaire.get('competitors') as FormArray;
  }

  createHuman(): FormGroup {
    return this.formBuilder.group({
      position: [''],
      task: [''],
      skills: [''],
      profile: [''],
      salary: [''],
    });
  }

  addHuman() {
    (this.formulaire.get('humans') as FormArray).push(this.createHuman());
  }

  getHumanResourcesFormArray() {
    return this.formulaire.get('humans') as FormArray;
  }

  createSupplier(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      amount: [''],
    });
  }
  getSuppliersFormArray(): FormArray {
    return this.formulaire.get('investment.suppliers') as FormArray;
  }

  addSupplier() {
    this.getSuppliersFormArray().push(this.createSupplier());
  }


  createVariableCost(): FormGroup {
    return this.formBuilder.group({
      variablename: [''],
      variableCost: [0.0],
    });
  }
  createFixedCost(): FormGroup {
    return this.formBuilder.group({
      fixedname: [''],
      fixedCost: [0.0],
    });
  }
  getFixedCostFormArray() {
    return this.formulaire.get('fixedcosts') as FormArray;
  }
  getVariableCostFormArray() {
    return this.formulaire.get('variablecosts') as FormArray;
  }

  addVariablecost() {
    (this.formulaire.get('variablecosts') as FormArray).push(this.createVariableCost());
  }
  addFixedcost() {
    (this.formulaire.get('fixedcosts') as FormArray).push(this.createFixedCost());
  }

  createOffers(): any {
    return this.formBuilder.group({
      offername: [''],
      offerprice: [''],
    });
  }

  getOffersFormArray(): FormArray {
    return this.formulaire.get('financialforecast.offers') as FormArray;
  }

  addOffer() {
    this.getOffersFormArray().push(this.createOffers());
  }

  // onsubmit
  onSubmit() {
    console.log(this.formulaire.value);
  }
}
