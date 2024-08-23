import { Component, OnInit } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { param } from 'jquery';
import { ProblemService } from '../../services/problemService/problem.service';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-problem',
  standalone: true,
    imports: [HeaderComponent, FooterComponent,HttpClientModule,RouterLink,SplitButtonModule,CommonModule],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
  providers: [ProblemService,MessageService],
})
export class ProblemComponent implements OnInit {

  problem: any = {}; 
  problemID : any
  author: any
  safeHtml: SafeHtml | undefined;
  itsmine = false
 
  constructor(private route : ActivatedRoute, private problemService: ProblemService,private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.problemID = params.get('problem');
      this.loadProblemInfo(this.problemID)
    });
  }
  seeAll() {
    throw new Error('Method not implemented.');
  }

  loadProblemInfo(id:any){
    this.problemService.getProblemById(id).subscribe(
      (value) => {
        this.problem = value.message
        let email = localStorage.getItem("email")
        if(email == value.user){
          this.itsmine = true
        }else{
          this.itsmine = false
        }
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(value.message.about_problem);
      },
      error => {
        
      }
    )
  }

  
}
