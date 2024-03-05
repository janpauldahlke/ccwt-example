import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterComponent } from './pokemon/filter/filter.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {CapitalizePipe} from "./pokemon/filter/pipes/capitalize.pipe";
import {NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    CapitalizePipe,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    NgOptimizedImage
  ],
  exports: [
    CapitalizePipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
