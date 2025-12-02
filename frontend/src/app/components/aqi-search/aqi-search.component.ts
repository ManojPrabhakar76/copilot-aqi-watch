import { Component } from '@angular/core';
import { AqiService } from '../../services/aqi.service';
import { Location, AQIData } from '../../models/location.model';

@Component({
  selector: 'app-aqi-search',
  templateUrl: './aqi-search.component.html',
  styleUrls: ['./aqi-search.component.css']
})
export class AqiSearchComponent {
  searchQuery: string = '';
  locations: Location[] = [];
  selectedLocation: Location | null = null;
  aqiData: AQIData | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(private aqiService: AqiService) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.locations = [];
    this.selectedLocation = null;
    this.aqiData = null;

    this.aqiService.searchLocations(this.searchQuery).subscribe({
      next: (locations) => {
        this.locations = locations;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to search locations. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSelectLocation(location: Location): void {
    this.selectedLocation = location;
    this.loading = true;
    this.error = '';

    this.aqiService.getAQI(location.lat, location.lon).subscribe({
      next: (data) => {
        this.aqiData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch AQI data. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getAQIColor(aqi: number): string {
    // Indian AQI color scheme
    if (aqi <= 50) return '#00e400'; // Good - Green
    if (aqi <= 100) return '#a7d500'; // Satisfactory - Light Green
    if (aqi <= 200) return '#ffff00'; // Moderate - Yellow
    if (aqi <= 300) return '#ff7e00'; // Poor - Orange
    if (aqi <= 400) return '#ff0000'; // Very Poor - Red
    return '#8f3f97'; // Severe - Purple
  }

  getAQIIcon(aqi: number): string {
    if (aqi <= 50) return '😊';
    if (aqi <= 100) return '🙂';
    if (aqi <= 200) return '😐';
    if (aqi <= 300) return '😷';
    if (aqi <= 400) return '🤢';
    return '☠️';
  }

  getHealthMessage(aqi: number): string {
    if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    if (aqi <= 100) return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
    if (aqi <= 200) return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    if (aqi <= 300) return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    if (aqi <= 400) return 'Health alert: The risk of health effects is increased for everyone.';
    return 'Health warning of emergency conditions: everyone is more likely to be affected.';
  }
}
