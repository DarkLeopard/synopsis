import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { EntryComponent } from './entry/entry.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CoreModule} from "./core.module";

@NgModule({
  declarations: [
    EntryComponent
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [EntryComponent]
})
export class AppModule { }
