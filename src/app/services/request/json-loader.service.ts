import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLoaderService 
{
  constructor(private http: HttpClient) { }

  getJSON(path : string): Observable<any> 
  {
    return this.http.get(path);
  }
}
