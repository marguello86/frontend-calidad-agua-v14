import { SnhCatPacientesService } from 'src/app/services/catalogos/snh-cat-pacientes.service';
import { SbcCatEntidadesService } from 'src/app/services/service.index';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeNI from '@angular/common/locales/es-NI';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from 'src/modules/angular.module';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CaptacionPersonaComponent } from './components/captacion-persona/captacion-persona.component';
import { SbcCatColectivosComboComponent } from './components/catalogos/sbc-cat-colectivos-combo/sbc-cat-colectivos-combo.component';
import { SbcCatEntidadesComboComponent } from './components/catalogos/sbc-cat-entidades-combo/sbc-cat-entidades-combo.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BuscadorPersonasComponent } from './components/persona/buscador-personas/buscador-personas.component';
import { AgregarDatosClinicosComponent } from './components/persona/agregar-datos-clinicos/agregar-datos-clinicos.component';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';
import { DialogoAsignarUnidadComponent } from './components/dialogo-asignar-unidad/dialogo-asignar-unidad.component';
import { PersonaComponent } from './components/persona/persona.component';
import { DialogoPersonaComponent } from './components/persona/dialogo-persona/dialogo-persona.component';
import { ListPersonasComponent } from './components/persona/list-personas/list-personas.component';
import { EditorPersonaComponent } from './components/persona/editor-persona/editor-persona.component';
import { ErrorDetailComponent } from './components/utility/error-detail/error-detail.component';
import { EditorStepByStepComponent } from './components/persona/editor-step-by-step/editor-step-by-step.component';
import { MenulistitemComponent } from './components/sidebarpropuesta/menulistitem/menulistitem.component';
import { SidebarpropuestaComponent } from './components/sidebarpropuesta/sidebarpropuesta.component';
import { DatePipe } from './directivas/text-transform/date.pipe';
import { TextTransformDirective } from './directivas/text-transform/text-transform.directive';
import { DialogSearchLitePersonaComponent } from './components/persona/dialog-search-lite-persona/dialog-search-lite-persona.component';
import { PasswordConfirmComponent } from './components/utility/password-confirm/password-confirm.component';
import localeNiExtra from '@angular/common/locales/es';
import { DigitalClockComponent } from './components/utility/digital-clock/digital-clock.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PacienteDetalleComponent } from './components/persona/paciente-detalle/paciente-detalle.component';
import { MinsaPersonalLookupComponent } from './components/persona/minsa-personal-lookup/minsa-personal-lookup.component';

import { SbcCatColectivosService } from './../services/catalogos/sbc-cat-colectivos.service';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BuscadorPersonasGenericoComponent } from './components/persona/buscador-personas-generico/buscador-personas-generico.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogoMinsaPersonalComponent } from './components/dialogo-minsa-personal/dialogo-minsa-personal.component';

registerLocaleData(localeNI, 'es-NI', localeNiExtra);

@NgModule({
  declarations: [
    EditorStepByStepComponent,
    PasswordConfirmComponent,
    DigitalClockComponent,
    NoPageFoundComponent,
    PersonaComponent,
    SbcCatColectivosComboComponent,
    SbcCatEntidadesComboComponent,
    BuscadorPersonasComponent,
    DialogSearchLitePersonaComponent,
    ListPersonasComponent,
    EditorPersonaComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    BreadcrumbComponent,
    CaptacionPersonaComponent,
    ErrorDetailComponent,
    MenulistitemComponent,
    SidebarpropuestaComponent,
    DatePipe,
    TextTransformDirective,
    DialogoAsignarUnidadComponent,
    DialogoPersonaComponent,
    AgregarDatosClinicosComponent,
    PacienteDetalleComponent,
    MinsaPersonalLookupComponent,
    BuscadorPersonasGenericoComponent,
    DialogoMinsaPersonalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxMatSelectSearchModule,
    PdfViewerModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    DigitalClockComponent,
    MaterialModule,
    NgxSpinnerModule,
    PersonaComponent,
    SbcCatColectivosComboComponent,
    SbcCatEntidadesComboComponent,
    BuscadorPersonasComponent,
    EditorPersonaComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    BreadcrumbComponent,
    CaptacionPersonaComponent,
    ErrorDetailComponent,
    MenulistitemComponent,
    SidebarpropuestaComponent,
    DatePipe,
    TextTransformDirective,
    AgregarDatosClinicosComponent,
    MinsaPersonalLookupComponent,
    BuscadorPersonasGenericoComponent,
    DialogoPersonaComponent,
    DialogoMinsaPersonalComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-NI' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-NI' },
    { provide: MatDialogRef, useValue: {} },
    SbcCatColectivosService,
    SbcCatEntidadesService,
    SnhCatPacientesService,
  ],
  entryComponents: [
    EditorStepByStepComponent,
    DialogSearchLitePersonaComponent,
    DialogoAsignarUnidadComponent,
    DialogoPersonaComponent,
    DialogoMinsaPersonalComponent,
  ],
})
export class SharedModule {}
