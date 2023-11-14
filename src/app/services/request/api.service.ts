import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { 
  }

  startGame(name: string): Observable<string> {
    const params = new HttpParams().set('name', name);
    return this.http.post<string>(this.baseUrl + '/game/start', null, { params });
  }

  getCard(gameId: string): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/game/get/' + gameId);
  }
  
  drawCard(gameId: string): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/game/draw/' + gameId);
  }

  scores(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/scores');
  }

  getUser(name: string): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/scores/' + name);
  }


  quit(gameId: string): Observable<Response> {
    return this.http.delete<Response>(this.baseUrl + '/game/quit/' + gameId);
  }

  getDeck(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl + '/game/deck');
  }

}