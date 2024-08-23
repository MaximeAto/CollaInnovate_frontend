import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProblemService } from '../../services/problemService/problem.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { SolutionService } from '../../services/solutionService/solution.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,HttpClientModule,RouterLink,CommonModule],
  templateUrl: './solution.component.html',
  styleUrl: './solution.component.scss',
  providers: [SolutionService,MessageService],

})
export class SolutionComponent {

  solution: any = {}; 
  solutionID : any
  author: any
  safeHtml: SafeHtml | undefined;
  itsmine = false

  constructor(private route : ActivatedRoute, private solutionService: SolutionService,private sanitizer: DomSanitizer){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.solutionID = params.get('solution');
      this.loadSolutionInfo(this.solutionID)
    });
  }

  loadSolutionInfo(id:any){
    this.solutionService.getSolutionById(id).subscribe(
      (value : any) => {
        this.solution = value.message
        let email = localStorage.getItem("email")
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(value.message.description);
      },
      (error) => {
        
      }
    )
  }

}
