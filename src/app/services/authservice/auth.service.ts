import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";




const httpOptions3 = {
  headers: new HttpHeaders({
  }),
  withCredentials: true
};

const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain', // modifier le Content-Type
  }),
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  BaseUrl = environment.api

  constructor(private http: HttpClient) { }

  signup(formData: FormData):Observable<any>{
    return this.http.post(`${this.BaseUrl}users/create`, formData,httpOptions3);
  }

  signin(formData:FormData):Observable<any>{
    return this.http.post(`${this.BaseUrl}auth/login`, formData,httpOptions3);
  }

  verifyemail(pingcode: any, email:any):Observable<any>{
    return this.http.get(`${this.BaseUrl}auth/emailconfirmation/`+ pingcode + "/" + email);
  }

  resendCodePing(email:any){
    return this.http.get(`${this.BaseUrl}auth/resendvalidation/` + email )
  }

  refreshtoken(email:string){
    return this.http.get(`${this.BaseUrl}auth/refreshtoken/` + email );
  }

  decoderToken(token: any) {
    try {
      const decoded = jwtDecode(token)
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAuthenticated(AccountToken: any): boolean {
  
    if (AccountToken) {
      return this.isValidToken(AccountToken);
    }
    return false;
  }

  isValidToken(AccountToken: any): boolean {
    const expirationDate = this.getTokenExpirationDate(AccountToken);
    return expirationDate && expirationDate > new Date()? true : false;
  }

  private getTokenExpirationDate(AccountToken: string): Date | null {
    let decodedToken: any = this.decoderToken(AccountToken);
    if (decodedToken && decodedToken.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate;
    }
    return null;
  }

  
  getToken(email:any):Observable<any>{
    return this.http.get(`${this.BaseUrl}sessions/gettoken/` + email );
  }

  resetpassword(email:any):Observable<any>{
    return this.http.get(`${this.BaseUrl}auth/resetpassword/` + email );
  }

}
