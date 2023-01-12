import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_ROUTES } from './app.routes';
import { LoginComponent } from './pages/login/login.component';
import { NextStepLoginComponent } from './pages/next-step-login/next-step-login.component';
import {  NgxSpinnerModule } from "ngx-spinner";
import { ServiceModule } from './services/service.module';
import { SharedModule } from './shared/shared.module';
import { PagesComponent } from './pages/pages.component';
import { LogoutComponent } from './pages/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,    
    NextStepLoginComponent,
    PagesComponent,
    LogoutComponent,   
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    BrowserAnimationsModule,
    NgxSpinnerModule,  
    SharedModule,
    ServiceModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
