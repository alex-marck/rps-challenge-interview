import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { MatchPageComponent } from './match-page/match-page.component';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    MatchPageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
