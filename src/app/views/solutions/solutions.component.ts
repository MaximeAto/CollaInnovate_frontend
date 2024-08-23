import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProblemService } from '../../services/problemService/problem.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SolutionService } from '../../services/solutionService/solution.service';
import { ButtonModule } from 'primeng/button';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ScrollerModule } from 'primeng/scroller';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { FavorisService } from '../../services/favorisService/favoris.service';

@Component({
  selector: 'app-solutions',
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
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss',
  providers: [ProblemService, SolutionService,FavorisService],
})
export class SolutionsComponent implements OnInit, AfterViewInit, OnDestroy {
  data = <any>[];
  problem: any = {};
  problemID: any;
  activeTab: string = 'all';

  sidebarVisible2: boolean = false;

  countries = [
    { name: 'Algérie', code: 'DZ' },
    { name: 'Angola', code: 'AO' },
    { name: 'Bénin', code: 'BJ' },
    // Ajoutez tous les pays ici
  ];
  categories = [
    'Operations Management',
    'Finance',
    'Human Resources',
    'Marketing',
    // Ajoutez toutes les catégories ici
  ];
  solutionFilter: any = { title: '' };
  filteredData: any[] = [];
  paginatedData: any[] = [];
  favorisList: any;
  rows: number = 10;
  totalRecords: number = 0;
  lazyLoading: boolean = true;
  loadLazyTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private sanitizer: DomSanitizer,
    private solutionService: SolutionService,
    private favorisService: FavorisService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.problemID = params.get('problem');
      this.loadProblemInfo(this.problemID);
      this.allSolutionForProblem(this.problemID);
      this.loadFavoris()
    });
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

  loadProblemInfo(id: any) {
    this.problemService.getProblemById(id).subscribe(
      (value) => {
        this.problem = value.message;
      },
      (error) => {}
    );
  }

  allSolutionForProblem(id: any) {
    this.solutionService.allSolutionForProblem(id).subscribe(
      (value : any) => {
        this.filteredData = value;
        this.data = value;
        this.totalRecords = this.filteredData.length;
        this.paginateData({ first: 0, rows: this.rows });
        console.log(value);
        
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
      // case 'recent':
      //   this.filteredData = this.data.filter(
      //     (item: { dateAdded: string | number | Date }) => {
      //       const dateAdded = new Date(item.dateAdded);
      //       const timeDifference = now.getTime() - dateAdded.getTime();
      //       const hoursDifference = timeDifference / (1000 * 3600);
      //       return hoursDifference <= 24;
      //     }
      //   );
      //   console.log('recent');
      //   console.log(this.filteredData.length);
      //   break;
      case 'favorite':
        this.filteredData = this.data.filter(
          (item: { id: number }) => this.favorisList.includes(item.id)
        );
        break;
      default:
        this.filteredData = this.data;
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
