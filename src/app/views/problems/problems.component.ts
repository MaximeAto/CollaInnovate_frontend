import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../layout';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import {
  ProblemService,
  Problem,
} from '../../services/problemService/problem.service';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { PaginatorModule } from 'primeng/paginator';
import {ScrollerModule } from 'primeng/scroller';
import {TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { FavorisService } from '../../services/favorisService/favoris.service';
import {GoogleMapsModule} from '@angular/google-maps'

interface LazyEvent {
  first: number;
  last: number;
}

export interface DataItem {
  id: number;
  account_id: number;
  title: string;
  about_problem: string;
  category: string;
  deadline: string;
  dateAdded: string;
  activity_requiring_improvement?: string;
  affected_population?: string;
  concerns_of_affected_population?: string;
  impact_on_affected_population?: string;
  quantitative_volume_affected_population?: number;
}



@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    FooterComponent,
    CommonModule, 
    RouterLink,
    HttpClientModule,
    ScrollerModule,
    FilterPipeModule,
    PaginatorModule,
    TableModule,
    SidebarModule,
    ButtonModule,
    GoogleMapsModule
  ],
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.scss',
  providers: [ProblemService,FavorisService],
})
export class ProblemsComponent implements OnInit, AfterViewInit, OnDestroy {

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

  sidebarVisible2: boolean = false;
  lazyLoading: boolean = true;
  loadLazyTimeout: any;
  activeTab: string = 'all';
  problemFilter: any = { title: '' };
  filterForm!: FormGroup;
  data: any
  filteredData: DataItem[] = []
  paginatedData: DataItem[] = [];
  rows: number = 10;
  totalRecords: number = 0;
  dtElement: any;
  favorisIcon = "fa-regular fa-star"
  favorisList:any[] = []
  isFillStart = false
  selectedDate: any;
  selectedCategory: any;
  userID : string = "";
  dateAdded : any;
  display: any;
  center!: google.maps.LatLngLiteral;
  zoom = 24;

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemService,
    private favorisService: FavorisService
  ) {}

  ngOnInit(): void {
    this.loadProblems()
    this.loadFavoris()
    this.getUserLocation();
  }

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

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(this.center);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

      /*------------------------------------------
    --------------------------------------------
    moveMap()
    --------------------------------------------
    --------------------------------------------*/
    moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  /*------------------------------------------
  --------------------------------------------
  move()
  --------------------------------------------
  --------------------------------------------*/
  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  loadProblems(){
    let email = localStorage.getItem('email')!
    this.problemService.getProblems(email).subscribe(
      (data: any) => {
        this.filteredData = data.problems
        this.userID = data.user_id
        this.data = data.problems
        this.totalRecords = this.filteredData.length;
        this.paginateData({ first: 0, rows: this.rows });
      },
      error => {
       
      }
    );
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.filterData();
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

  onPageChange(event: any) {
    this.paginateData(event);
  }

  filterData() {
    const now = new Date();
    let filteredData = [];

    // Apply primary filters
    switch (this.activeTab) {
      case 'all':
        filteredData = this.data;
        break;
      case 'recent':
        filteredData = this.data.filter(
          (item: { dateAdded: string | number | Date }) => {
            const dateAdded = new Date(item.dateAdded);
            const timeDifference = now.getTime() - dateAdded.getTime();
            const hoursDifference = timeDifference / (1000 * 3600);
            return hoursDifference <= 24;
          }
        );
        break;
      case 'favorite':
        filteredData = this.data.filter(
          (item: { id: number }) => this.favorisList.includes(item.id)
        );
        break;
      case 'my':
        filteredData = this.data.filter(
          (item: { user_id: string }) => item.user_id === this.userID
        );
        break;
      default:
        filteredData = this.data;
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
      
      filteredData = filteredData.filter(
        (item: { dateAdded: string | number | Date }) => {
          const dateAdded = new Date(item.dateAdded);
          return dateAdded >= startDate && dateAdded <= now;
        }
      );
  }

  if (this.selectedCategory) {
      filteredData = filteredData.filter(
        (item: { category: string }) => item.category === this.selectedCategory
      );
  }

    this.filteredData = filteredData;
    this.totalRecords = this.filteredData.length;
    this.paginateData({ first: 0, rows: this.rows });
}


  onSearchChange() {
    this.filterData();
  }

  loadFavoris(){
    const user_mail = localStorage.getItem("email")

    this.favorisService.listOfFavoris(user_mail,"p").subscribe(
      (value: any[])=>{
        this.favorisList = value
      },
      error =>{
        console.log(error.error);
      }
    )
  }
  
  toggleFavorite(id: number) {
    let email = localStorage.getItem('email');
    if (this.favorisList.includes(id)) {
      this.favorisService.removeFavorite(id, 'p', email).subscribe(() => {
        this.favorisList = this.favorisList.filter(favId => favId !== id);
      });
    } else {
      let favoris = {
        "email": email,
        "type": "p",
        "favoris_id": id
      };
      this.favorisService.addToFavoris(favoris).subscribe(() => {
        this.favorisList.push(id);
      });
    }
  }
  


  changeview() {}
}
