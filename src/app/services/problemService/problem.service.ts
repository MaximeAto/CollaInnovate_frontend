import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


const httpOptions3 = {
  headers: new HttpHeaders({}),
};

const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain', // modifier le Content-Type
  }),
};

export interface Problem {
  id: number;
  account_id: number;
  title: string;
  about_problem: string;
  country: string;
  city: string;
  category: string;
  deadline: string;
  dateAdded: string;
  activity_requiring_improvement?: string;
  affected_population?: string;
  concerns_of_affected_population?: string;
  impact_on_affected_population?: string;
  quantitative_volume_affected_population?: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  BaseUrl = environment.api
  
  constructor(private http: HttpClient) { }

  addproblem(formData:FormData, email:any):Observable<any>{
    return this.http.post(`${this.BaseUrl}problems/add/` + email, formData,httpOptions3);
  }

  getProblems(email : string): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.BaseUrl + "problems/all/"+ email);
  }

  getProblemById(id: any):Observable<any> {
    return this.http.get<any>(this.BaseUrl + "problems/get/" + id);
  }


}
