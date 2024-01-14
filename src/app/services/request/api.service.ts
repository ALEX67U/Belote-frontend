import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = 'http://localhost:8080';

  private headers: HttpHeaders = new HttpHeaders;

  initToken(token : string)
  {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  constructor(private http: HttpClient) 
  {
    const token = localStorage.getItem('token')
    if(token)
      this.initToken(token)
  }

  startGame(name: string): Observable<string> {
    const params = new HttpParams().set('name', name);
    return this.http.post<string>(this.baseUrl + '/game/start', null, { params });
  }

  getCard(gameId: string): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/game/action/get/' + gameId, { headers: this.headers });
  }
  
  drawCard(gameId: string): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/game/action/draw/' + gameId, { headers: this.headers});
  }

  scores(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/scores');
  }

  getUser(name: string): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/scores/' + name);
  }


  quit(gameId: string): Observable<Response> {
    return this.http.delete<Response>(this.baseUrl + '/game/action/quit/' + gameId, { headers: this.headers});
  }

  getDeck(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/game/deck');
  }

}