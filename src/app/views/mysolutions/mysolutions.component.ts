import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favorisService/favoris.service';
import { ProblemService } from '../../services/problemService/problem.service';
import { SolutionService } from '../../services/solutionService/solution.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent, HeaderComponent } from '../../layout';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-mysolutions',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterLink,
    HttpClientModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    FilterPipeModule,
    ScrollerModule,
    SidebarModule,
  ],
  templateUrl: './mysolutions.component.html',
  styleUrl: './mysolutions.component.scss',
  providers: [ProblemService, SolutionService,FavorisService],
})
export class MysolutionsComponent  implements OnInit, AfterViewInit, OnDestroy {

  data = <any>[];
  problem: any = {};
  activeTab: string = 'all';

  sidebarVisible2: boolean = false;

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
  solutionFilter: any = { title: '' };
  filteredData: any[] = [];
  paginatedData: any[] = [];
  favorisList: any;
  rows: number = 10;
  totalRecords: number = 0;
  lazyLoading: boolean = true;
  loadLazyTimeout: any;
  userID : string = "";
  problems : any[] = []
  selectedDate: any;
  selectedCategory: any;
  selectedProblem: any;


  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private sanitizer: DomSanitizer,
    private solutionService: SolutionService,
    private favorisService: FavorisService

  ) {}

  ngOnInit(): void {
      this.allSolution(localStorage.getItem("email"));
      this.loadFavoris()
  }

  dtElement: any;

  ngAfterViewInit(): void {
    if (this.loadLazyTimeout) {
      clearTimeout(this.loadLazyTimeout);
    }
  }


  ngOnDestroy(): void {
    if (this.dtElement) {
      this.dtElement.destroy();
    }
    if (this.loadLazyTimeout) {
      clearTimeout(this.loadLazyTimeout);
    }
  }


  allSolution(id: any) {
    this.solutionService.allSolution(id).subscribe(
      (value : any) => {
        this.filteredData = value.solutions;
        this.data = value.solutions;
        this.userID = value.user_id;
        this.problems = value.problems;
        this.totalRecords = this.filteredData.length;
        this.paginateData({ first: 0, rows: this.rows });
        
      },
      (error) => {}
    );
  }

  loadFavoris(){
    const user_mail = localStorage.getItem("email")

    this.favorisService.listOfFavoris(user_mail,"s").subscribe(
      (value: any[])=>{
        this.favorisList = value
      },
      error =>{
      }
    )
  }

  paginateData(event: { first: number; rows: number }) {
    const { first, rows } = event;
    this.lazyLoading = true;

    if (this.loadLazyTimeout) {
      clearTimeout(this.loadLazyTimeout);
    }
    this.paginatedData = this.filteredData.slice(first, first + rows);
    

    this.loadLazyTimeout = setTimeout(() => {
      this.lazyLoading = false;
    }, 5000);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.filterData();
  }

  filterData() {
    const now = new Date();

    switch (this.activeTab) {
      case 'all':
        this.filteredData = this.data;
        break;
      case 'recent':
        this.filteredData = this.data.filter(
          (item: { dateAdded: string | number | Date }) => {
            const dateAdded = new Date(item.dateAdded);
            const timeDifference = now.getTime() - dateAdded.getTime();
            const hoursDifference = timeDifference / (1000 * 3600);
            return hoursDifference <= 24;
          }
        );
        console.log('recent');
        console.log(this.filteredData.length);
        break;
      case 'favorite':
        this.filteredData = this.data.filter(
          (item: { id: number }) => this.favorisList.includes(item.id)
        );
        break;
      case 'my':
        this.filteredData = this.data.filter(
          (item: { user_id: string }) => item.user_id === this.userID
        );
        break;
      default:
        this.filteredData = this.data;
    }

    if (this.selectedDate) {
      let startDate: number | Date;
      switch (this.selectedDate) {
        case 'last_week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last_month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }
      
      this.filteredData = this.filteredData.filter(
        (item: { dateAdded: string | number | Date }) => {
          const dateAdded = new Date(item.dateAdded);
          return dateAdded >= startDate && dateAdded <= now;
        }
      );
    }
    if (this.selectedCategory) {
      let idpbs = this.problems
      .filter((item: { category: string }) => item.category === this.selectedCategory)
      .map((item: { id: number }) => item.id);    

      this.filteredData = this.filteredData.filter(
        (item: { problem_id: number }) => idpbs.includes(item.problem_id)
      );
    }
    if(this.selectedProblem){
      let idpbs = this.problems
      .filter((item: { title: string }) => item.title === this.selectedProblem)
      .map((item: { id: number }) => item.id); 

      this.filteredData = this.filteredData.filter(
        (item: { problem_id: number }) => idpbs.includes(item.problem_id)
      );
    }

    this.totalRecords = this.filteredData.length;
    this.paginateData({ first: 0, rows: this.rows });
  }


  filterByDate(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    // Ajoutez la logique pour filtrer les données par date
  }

  filterByCategory(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    // Ajoutez la logique pour filtrer les données par catégorie
  }

  filterByCountry(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    // Ajoutez la logique pour filtrer les données par pays
  }

  toggleFavorite(id: number) {
    let email = localStorage.getItem('email');
    if (this.favorisList.includes(id)) {
      this.favorisService.removeFavorite(id, 's', email).subscribe(() => {
        this.favorisList = this.favorisList.filter((favId: number) => favId !== id);
      });
    } else {
      let favoris = {
        "email": email,
        "type": "s",
        "favoris_id": id
      };
      this.favorisService.addToFavoris(favoris).subscribe(() => {
        this.favorisList.push(id);
      });
    }
  }

  onPageChange(event: any) {
    this.paginateData(event);
  }

  onSearchChange() {
    this.filterData();
  }

  changeview() {}
}

