import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProblemService } from '../../services/problemService/problem.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { SolutionService } from '../../services/solutionService/solution.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    FooterComponent,
    FormsModule,
    HttpClientModule,
    RouterLink,
    CommonModule,
    SidebarModule,
    ButtonModule,
  ],
  templateUrl: './solution.component.html',
  styleUrl: './solution.component.scss',
  providers: [SolutionService, MessageService],
})
export class SolutionComponent {
  comments: any[] = []; 
  commentForm!: FormGroup;
  username = ""
  errorAdd: boolean = false;
  solution: any = {};
  solutionID: any;
  author: any;
  safeHtml: SafeHtml | undefined;
  itsmine = false;
  sidebarVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private solutionService: SolutionService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.solutionID = params.get('solution');
      this.loadSolutionInfo(this.solutionID);
      this.getComments(this.solutionID)
      localStorage.setItem("solutionId", this.solutionID)
    });
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required] // Champ comment form
    });

    this.username != localStorage.getItem("user")
  }

  loadSolutionInfo(id: any) {
    this.solutionService.getSolutionById(id).subscribe(
      (value: any) => {
        this.solution = value.message;
        let email = localStorage.getItem('email');
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
          value.message.description
        );
      },
      (error) => {}
    );
  }

  openSidebar(){
    this.sidebarVisible = true;
  }

  getComments(solutionid : number): void {
    this.solutionService.getCommentsBySolution(solutionid).subscribe((data: any) => {
      this.comments = data;
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const newComment = {
        user_email: localStorage.getItem("email"),
        dateAdded: new Date(),
        username: localStorage.getItem("user"),
        comment: this.commentForm.value.comment,
        solution_id : localStorage.getItem("solutionId")
      };

      this.solutionService.addComment(newComment).subscribe((response: any) => {
        this.comments.push(newComment); 
        this.commentForm.reset();
        this.errorAdd = false;
      });
    
    } else {
      this.errorAdd = true; 
    }
  }

  
}
