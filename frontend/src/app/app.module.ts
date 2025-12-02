import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AqiSearchComponent } from './components/aqi-search/aqi-search.component';
import { AqiService } from './services/aqi.service';

@NgModule({
  declarations: [
    AppComponent,
    AqiSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AqiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
