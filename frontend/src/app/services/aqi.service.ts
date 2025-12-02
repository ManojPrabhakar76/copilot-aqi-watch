import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location, AQIData } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class AqiService {
  private apiUrl = 'https://copilot-aqi-watch-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  searchLocations(query: string): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/search?query=${query}`);
  }

  getAQI(lat: number, lon: number): Observable<AQIData> {
    return this.http.get<AQIData>(`${this.apiUrl}/aqi/${lat}/${lon}`);
  }
}
