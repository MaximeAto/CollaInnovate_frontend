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



@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  BaseUrl = environment.api

  constructor(private http: HttpClient) { }
  
  addsolution(formData:FormData, email:any,problemId:any):Observable<any>{
    return this.http.post(`${this.BaseUrl}solutions/add/` + email + '/' + problemId, formData,httpOptions3);
  }

  allSolutionForProblem(problemId:any){
    return this.http.get(`${this.BaseUrl}solutions/all/` + problemId)
  }

  getSolutionById(id: any):Observable<any> {
    return this.http.get<any>(this.BaseUrl + "solutions/get/" + id);
  }

  allSolution(id: any):Observable<any> {
    return this.http.get(this.BaseUrl + "solutions/getall/" + id )
  }

  getCommentsBySolution(solutionId: number): Observable<any> {
    const url = `${this.BaseUrl}/comments/get_by_solution/${solutionId}`;
    return this.http.get(url)
  }

  addComment(commentData: any): Observable<any> {
    const url = `${this.BaseUrl}/comments/add_comment`;
    return this.http.post(url, commentData, httpOptions3)
  }

}
