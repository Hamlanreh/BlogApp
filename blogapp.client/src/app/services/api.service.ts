import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  get<T>(url: any, options: any): Observable<T> {
    return this.httpClient.get(url, options) as Observable<T>
  }

  post<T>(url: any, body: any, options: any): Observable<T> {
    return this.httpClient.post(url, body, options) as Observable<T>
  }

  put<T>(url: string, body: any, options: any): Observable<T> {
    return this.httpClient.put<T>(url, body, options) as Observable<T>;
  }

  delete<T>(url: string, options: any): Observable<T> {
    return this.httpClient.delete<T>(url, options) as Observable<T>;
  }

}
