import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class FavorisService {

  BaseUrl = environment.api
  
  constructor(private http: HttpClient) { }

  addToFavoris(favoris:any) {
    return this.http.post(this.BaseUrl + "favoris/add", favoris, httpOptions3);
  }

  removeFavorite(id:any, type:any, email:any) {
    return this.http.delete(this.BaseUrl + "favoris/delete/" + email + "/" + type + "/" + id)
  }

  listOfFavoris(email:any, type:any){
    return this.http.get<any[]>(this.BaseUrl + "favoris/list/" + email + "/" + type )
  }
}
