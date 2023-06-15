import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  
  protected baseUrllocal = 'http://localhost:3000';
  // protected baseUrldev = 'http://54.202.218.249:9501/api';
  
  postUser(data: any) {
    return this.http
      .post<any>(`${this.baseUrllocal}/users`, data)
      .pipe(map((res) => res));
  }
  
  getUser() {
    return this.http
      .get<any>(`${this.baseUrllocal}/users`)
      .pipe(map((res) => res));
  }
  
  updateUser(data: any, id: number){
    return this.http
    .put<any>(`${this.baseUrllocal}/users/${id}`,data)    
  }

  deleteUser(id: number){
    return this.http
    .delete<any>(`${this.baseUrllocal}/users/${id}`)
  }
}
