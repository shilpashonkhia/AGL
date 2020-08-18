import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const AglApiUrl = 'http://agl-developer-test.azurewebsites.net/people.json';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }
  getPeoples() {
    return this.http.get(AglApiUrl);
  }
}
