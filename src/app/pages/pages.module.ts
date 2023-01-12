import { CommonModule, registerLocaleData } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PAGES_ROUTES } from './pages.routes';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    //ReportesModule,
    PAGES_ROUTES
  ],



  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ DashboardComponent ],
  providers: [Title, DatePipe],
})
export class PagesModule { }
