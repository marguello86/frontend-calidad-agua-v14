import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { InterceptortokenService } from '../interceptor/interceptortoken.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SbcCatEntidadesService } from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    //LoginService,
    SbcCatEntidadesService,
    NgxSpinnerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptortokenService,
      multi: true
    }
  ]
})

export class ServiceModule { }
