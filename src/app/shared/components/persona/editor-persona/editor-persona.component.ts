import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit, ChangeDetectorRef, Component, DoCheck, ElementRef, EventEmitter,
  OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
//import { DateAdapter, MatDatepickerInputEvent, MAT_DATE_FORMATS, NativeDateAdapter, MatSlideToggleChange, MatAccordion } from '@angular/material/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { SYSTEM } from 'src/app/services/constantes';
import { ComunidadService, PacienteService, PersonaService, SectorService } from 'src/app/services/service.index';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ControlRegistro, Edad, Persona } from 'src/app/shared/models/persona/persona.models';
import Swal from 'sweetalert2';
import { SbcCatEntidadesComboComponent } from '../../catalogos/sbc-cat-entidades-combo/sbc-cat-entidades-combo.component';
import { TODAY, PATTERN_PRIMER_NOMBRE_APELLIDO, PATTERN_SEGUNDO_NOMBRE_APELLIDO } from '../persona.const';

export const CUSTOM_DATE_FORMAT = {
  /*parse: {
    dateInput: ['dd'],
  },
  display: {
    dateInput: 'dd',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }*/
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  // parse: { dateInput: { month: 'MMMM', year: 'yyyy', day: 'dd' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  //format(date: Date, displayFormat: Object): string {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return date.toLocaleDateString('es-NI');
      /*let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;*/
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-editor-persona',
  templateUrl: './editor-persona.component.html',
  styleUrls: ['./editor-persona.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT }]
})
export class EditorPersonaComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {

  public data: Persona;
  private dataBackup: Persona;
  private subject$: Subject<void> = new Subject();
  public msgErrorCoincidence: string = '';
  public showActionsAddPerson: boolean = false;
  @Output('showCaptacionStep') showCaptacionStep: EventEmitter<boolean> = new EventEmitter();
  //@ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;

  startDate: Date = new Date();


  /*declaración de reactive forms */

  personaForm: FormGroup;
  /*declaración de reactive forms */

  @ViewChild('nttMncp', { static: true }) nttMncp: SbcCatEntidadesComboComponent;
  @ViewChild('nttCmnd', { static: true }) nttCmnd: SbcCatEntidadesComboComponent;
  @ViewChild('departamentResidencia', { static: true }) departamentResidencia: SbcCatEntidadesComboComponent;
  @ViewChild('municipioBorn', { static: false }) municipioBorn: SbcCatEntidadesComboComponent;
  @ViewChild('identificacion', { static: true }) identificacion: ElementRef;

  public showCmbComunidades: boolean = false;
  public isForeign: boolean = true;
  public isDifunto: boolean = false;
  public isPrechaged: boolean = false;
  public errorComunity: boolean = false;
  public error: { title: string, message: string; };
  private isDestroyed: boolean = false;
  public maxDate: Date = TODAY;
  public infoResidenceIncomplete: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router, private apiPersona: PersonaService,
    private apiPx: PacienteService,
    private apiComunidad: ComunidadService,
    private apiSector: SectorService,
    private spinner: NgxSpinnerService,
    private _changeDetector: ChangeDetectorRef) {
    this.validatePersonSelected();
    // this._changeDetector.markForCheck();
  }

  ngOnInit() {
    this.initReactiveForms();
    if (this.data) {
      if (!this.data.id || this.data.id === 0) {
        this.showCaptacionStep.emit(false);
        this.showActionsAddPerson = true;
        this.personaForm.get(['edadExacta']).disable();

      } else {
        this.personaForm.disable();
        // this.showCaptacionStep.emit(true);
        this.validateResidenceShowCaptacionStep();
      }
      this.personaForm.patchValue(this.data);
      this.personaForm.get('fechaNacimiento').setValue(`${this.personaForm.get('fechaNacimiento').value}T00:00:00`);
      this.evaluateExactAge();
      this.personaForm.markAsPristine();
      this.personaForm.markAsTouched();
      // this.personaForm.disable();
      this.validaPrecharged();
      this.dataBackup = this.data;
      this.validatePx();
      this.validateExistIdentificacion();
    }
  }

  ngAfterViewInit() { }

  ngDoCheck(): void { }

  validatePersonSelected(): void {
    let allow: boolean;
    this.apiPersona.personSelected$.pipe(takeUntil(this.subject$)).subscribe({
      next: p => {
        this.apiPersona.allowCreatePerson$.pipe(takeUntil(this.subject$)).subscribe({
          next: v => allow = v
        });
        if (!p && !allow && !this.isDestroyed) {
          Swal.fire('Lo sentimos no haz seleccionado un registro de Persona para realizar captación', 'Datos incompletos', 'error');
          this.router.navigate(['captacion']);
          return;
        }
        this.data = p;
        if (this.data) {
          if (this.data.fallecimiento) {
            if (this.data.fallecimiento.fallecido) { this.isDifunto = true; }
          }
          if (this.data.paciente) {
            if (this.data.paciente.precargado) {
              this.isPrechaged = true;
            }
          }
        }
      }
    });
  }

  initReactiveForms(): void {
    this.personaForm = this.formBuilder.group({
      id: [''],
      identificada: [''],
      tipoPersona: [''],

      identificacion: this.formBuilder.group({
        id: [''],
        codigo: [''],
        nombre: ['', [Validators.maxLength(50)]],
        valor: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      }),
      primerNombre: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),
      Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]],
      segundoNombre: ['', [Validators.maxLength(50), Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),
      Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]],
      segundoApellido: ['', [Validators.maxLength(50), Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]],
      fechaNacimiento: ['', [Validators.required, Validators.maxLength(50)]],
      edadExacta: ['', [Validators.maxLength(50)]],
      edad: this.formBuilder.group({
        anios: [''],
        meses: [''],
        dias: ['']
      }),
      sexo: this.formBuilder.group({
        id: [''],
        codigo: [''],
        valor: ['', [Validators.required, Validators.maxLength(50)]],
      }),
      fallecimiento: this.formBuilder.group({
        fallecido: ['']
      }),
      paciente: this.formBuilder.group({
        precargado: [true],
        codigoExpediente: this.formBuilder.group({
          id: [],
          codigo: [""],
          nombre: [""],
          valor: [""],
        }),
      }),
      updatepersona: [false],
      direcciondomicilio: [''],
      comunidad: this.formBuilder.group({
        id: ['']
      }),
      divisionPolitica: this.formBuilder.group({
        nacimiento: this.formBuilder.group({
          municipio: this.formBuilder.group({
            id: [null],
            nombre: [''],
            codigocsereg: [null]
          }),
          departamento: this.formBuilder.group({
            id: [null],
            nombre: [''],
          }),
          region: this.formBuilder.group({
            id: [null],
            nombre: [null],
          }),
          pais: this.formBuilder.group({
            id: [null],
            nombre: [''],
          })
        }),
        residencia: this.formBuilder.group({
          personaDireccion: ['', [Validators.required, Validators.maxLength(500)]],
          distrito: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            nombre: [{ value: '', disabled: true }]
          }),
          comunidad: this.formBuilder.group({
            id: [null],
            nombre: [''],
            localidad: this.formBuilder.group({
              id: [null],
              nombre: ['']
            })
          }),
          municipio: this.formBuilder.group({
            id: [null],
            nombre: [''],
          }),
          departamento: this.formBuilder.group({
            id: [null],
            nombre: [''],
          }),
          region: this.formBuilder.group({
            id: [null],
            nombre: [''],
          }),
          pais: this.formBuilder.group({
            id: [null],
            nombre: [''],
          })
        })
      }),
      redServicio: this.formBuilder.group({
        residencia: this.formBuilder.group({
          sector: this.formBuilder.group({
            id: ['', [Validators.required]],
            nombre: new FormControl({ value: '', disabled: true }, Validators.required),
          }),
          unidadSalud: this.formBuilder.group({
            id: ['', [Validators.required]],
            nombre: new FormControl({ value: '', disabled: true }, Validators.required),
          }),
          entidadAdministrativa: this.formBuilder.group({
            id: ['', [Validators.required]],
            nombre: new FormControl({ value: '', disabled: true }, Validators.required),
          })
        })
      })
    });
  }

  validateResidenceShowCaptacionStep(): void {
    if (this.data.divisionPolitica.residencia.comunidad.id === 0 ||
      this.data.divisionPolitica.residencia.municipio.id === 0 ||
      this.data.divisionPolitica.residencia.departamento.id === 0) {
      this.infoResidenceIncomplete = true;
      this.showCaptacionStep.emit(false);
    } else {
      this.infoResidenceIncomplete = false;
      this.showCaptacionStep.emit(true);
    }
  }

  evaluateExactAge(): void {
    const edadExacta = () => {
      const edad: Edad = this.personaForm.get('edad').value;
      return edad.anios !== '000' ? edad.anios + ' años, ' + edad.meses + ' meses y ' + edad.dias + ' días'
        : edad.meses !== '00' ? edad.meses + ' meses y ' + edad.dias + ' días' :
          edad.dias + ' días ';
    };
    this.personaForm.get('edadExacta').patchValue(edadExacta());
  }

  validaPrecharged(): void {
    if (this.data) {
      if (!this.data.paciente) { return; }
      this.personaForm.get(['updatepersona']).setValue(false);
      /*if (this.data.paciente.codigoExpediente.id > 0
        && this.data.paciente.precargado) {
        this.personaForm.get(['divisionPolitica', 'residencia']).enable();
        this.personaForm.get(['divisionPolitica', 'residencia', 'distrito']).disable();
      }*/
      if (this.isPrechaged) {
        this.personaForm.get(['updatepersona']).setValue(this.data.paciente.precargado);
        this.personaForm.get(['divisionPolitica', 'residencia']).enable();
        this.personaForm.get(['divisionPolitica', 'residencia', 'distrito']).disable();
        if (this.nttCmnd) { this.nttCmnd.selectCtrl.markAllAsTouched(); } else {
          if (this.nttMncp) { this.nttMncp.selectCtrl.markAllAsTouched(); } else {
            if (this.departamentResidencia) { this.departamentResidencia.selectCtrl.markAllAsTouched(); }
          }
        }
      }
    }
  }

  validatePx() {
    if (!this.data.paciente) { return; }
    if (this.data.paciente.id > 0) {
      this.apiPx.obtenerPorId(this.data.paciente.id)
        .subscribe({
          next: (r: any) => {
            if (r.datos) {
              /*if (!r.datos[0].telefono) { return; }
              this.personaForm.get('telefono').patchValue(r.datos[0].telefono);*/
            }
          }
        });
    }
  }

  typeIdentificacionSelected(identificacion: Catalogo): void {
    if (!identificacion) { return; }
    this.personaForm.get(['identificacion', 'codigo']).setValue(identificacion.codigo);
    this.validateIdentificacion();
  }

  typeGenderSelected(gender: Catalogo): void {
    if (!gender) { return; }
  }

  countryBornSelected(country: any): void {
    if (!country) { return; }
    if (country.codigoalfados.toUpperCase() === 'NI' && country.codigoalfatres.toUpperCase() === 'NIC' &&
      (country.nombre.toUpperCase() === 'NICARAGUA' || country.nombre.toUpperCase() === 'NICARAGÜA')) {
      this.isForeign = false;
    } else { this.isForeign = true; }
  }

  updateMunicipioBorn(deparment: any): void {
    if (this.isForeign) { return; }
    if (!this.municipioBorn) { return; }
    const vid = (deparment ? deparment.id || deparment : 0);
    this.municipioBorn.actualizarPorReferencia('departamento', vid);
    if (+vid > 0) {
      if (!this.personaForm.get('divisionPolitica').get(['nacimiento', 'departamento']).pristine) {
        this.resetFormsSpecific(this.personaForm.get(['divisionPolitica', 'nacimiento', 'municipio']));
        // this.personaForm.get('divisionPolitica').get('nacimiento').get('municipio').reset();
        // this.personaForm.get('divisionPolitica').get('nacimiento').get('municipio').markAsPristine();
      }
    }
    this._changeDetector.detectChanges();
  }

  municipioBornSelected(locality: any): void {
    if (!locality) { return; };
  }

  updateMunicipio(deparment: any): void {
    if (!this.nttMncp) { return; }
    const vid = (deparment ? deparment.id || deparment : 0);
    this.nttMncp.actualizarPorReferencia('departamento', vid);
    this.showCmbComunidades = true;
    if (+vid > 0) {
      if (!this.personaForm.get(['divisionPolitica', 'residencia', 'departamento']).pristine) {
        this.resetFormsSpecific(this.personaForm.get(['divisionPolitica', 'residencia', 'municipio']));
        this.resetFormsSpecific(this.personaForm.get(['divisionPolitica', 'residencia', 'comunidad']));
        this.resetFormsSpecific(this.personaForm.get(['divisionPolitica', 'residencia', 'distrito']));
        this.resetFormsSpecific(this.personaForm.get(['redServicio']));
      }
    }
    this._changeDetector.detectChanges();
  }

  updateComunidades(locality: any): void {
    if (!this.nttCmnd) { return; }
    const vid = (locality ? locality.id || locality : 0);
    this.nttCmnd.actualizarPorReferencia('municipio', vid);
    if (!this.personaForm.get(['divisionPolitica', 'residencia', 'municipio']).pristine) {
      this.resetFormsSpecific(this.personaForm.get(['divisionPolitica', 'residencia', 'distrito']));
      this.resetFormsSpecific(this.personaForm.get(['redServicio']));
    }
    this._changeDetector.detectChanges();
  }

  comunitySelected(comunity: any): void {
    if (!comunity) { return; }
    let sector: any[];
    if (comunity.id) {
      this.apiComunidad.obtenerPorId(comunity.id).subscribe((c: any) => {
        if (c.data) {
          this.errorComunity = false;
          this.personaForm.get(['divisionPolitica', 'residencia', 'distrito'])
            .patchValue(c.data[0].distrito);
        }
      });
      this.apiSector.obtenerPorReferencia(comunity.municipio.id, 0, 0).subscribe({
        next: (c: any) => {
          if (c.data) {
            this.errorComunity = false;
            sector = c.data;
            if (this.infoResidenceIncomplete && this.personaForm.valid) {
              this.infoResidenceIncomplete = true;
              this.showCaptacionStep.emit(true);
            }
          } else {
            this.errorComunity = true;
            Swal.fire(c.error, 'Información de red de servicio y sectorización incompleta', 'error');
            this.error = { title: 'Información de red de servicio y sectorización incompleta', message: c.error };
          }
        },
        error: e => { this.errorComunity = true; },
        complete: () => {
          if (!sector) { return; }
          sector.forEach(s => {
            if (s.comunidad.id === comunity.id) {
              this.personaForm.get(['redServicio', 'residencia', 'sector'])
                .patchValue(s);
              this.personaForm.get(['redServicio', 'residencia', 'unidadSalud'])
                .patchValue(s.unidades);
              this.personaForm.get(['redServicio', 'residencia', 'entidadAdministrativa'])
                .patchValue(s.unidades.entidadesadtvas);
              this.personaForm.get(['comunidad', 'id']).setValue(comunity.id);
              this.personaForm.get(['direcciondomicilio'])
                .setValue(this.personaForm.get(['divisionPolitica', 'residencia', 'personaDireccion']).value);
              this.apiPersona.personSelected$.next(this.personaForm.getRawValue());
            }
          });
        }
      });
      this.resetFormsSpecific(this.personaForm.get(['divisionPolitica', 'residencia', 'distrito']));
      this.resetFormsSpecific(this.personaForm.get('redServicio'));
    }
  }

  private resetFormsSpecific(typeForm: any): void {
    if (!typeForm) { return; }
    typeForm.reset();
    typeForm.markAsPristine();
  }

  dateChangeEvent(dateChange: MatDatepickerInputEvent<any>): void {
    const datePipe = new DatePipe('en-US');
    this.personaForm.get('fechaNacimiento').patchValue(datePipe.transform(dateChange.value, 'yyyy-MM-ddTHH:mm:ss', 'GMT-0600', 'es-NI'));
  }

  controlHasError(nameValidator: string, frm: FormControl | FormGroup, controlName: string[]): boolean | void {
    if (!controlName) { return; }
    switch (controlName.length) {
      case 0:
        return frm.hasError(nameValidator);
      default:
        if (frm.get(controlName)) {
          return frm.hasError(nameValidator, controlName) && (frm.get(controlName).touched);
        } else { return; }
    }
  }

  validateExistIdentificacion(): void {
    fromEvent(this.identificacion.nativeElement, 'keyup')
      .pipe(map((event: any) => event.target.value.toUpperCase()),
        filter(res => (res.length > 2)),
        debounceTime(2000),
        distinctUntilChanged())
      .subscribe((v) => {
        if (this.controlHasError('maxlength', this.personaForm, ['identificacion', 'valor'])) {
          return;
        }
        if (this.dataBackup.identificacion) {
          if (String(this.dataBackup.identificacion.valor).toUpperCase() ===
            String(this.personaForm.get(['identificacion', 'valor']).value).toUpperCase() &&
            String(this.dataBackup.identificacion.codigo).toUpperCase() ===
            String(this.personaForm.get(['identificacion', 'codigo']).value).toUpperCase()) {
            return;
          }
        }
        this.spinner.show();
        this.apiPersona.numIdentificacionExist(this.personaForm.get(['identificacion']).value)
          .subscribe(p => {
            if (p instanceof Array) {
              if (p.length > 0) {
                p.forEach((v: Persona) => {
                  this.msgErrorCoincidence = `${v.primerNombre} ${v.segundoNombre ? v.segundoNombre : null}` +
                    ` ${v.primerApellido} ${v.segundoApellido ? v.segundoApellido : null}`;
                  this.error = {
                    title: 'Identificación ya registrada',
                    message: `${v.primerNombre} ${v.segundoNombre ? v.segundoNombre : null}` +
                      ` ${v.primerApellido} ${v.segundoApellido ? v.segundoApellido : null}` +
                      `, se encuentra registrado con la misma identificación, favor de verificar`
                    /*message: v.primerNombre || ' ' || v.segundoNombre ? v.segundoNombre : null || ' ' ||
                      v.primerApellido || ' ' || v.segundoApellido ? v.segundoApellido : null ||
                      ', se encuentra registrado con la misma identificación, favor de verificar'*/
                  };
                });
                this.spinner.hide();
                this.personaForm.get(['identificacion']).setErrors({ duplicateIdentificacion: true });

              }
            } else { this.spinner.hide(); this.personaForm.setErrors({ duplicateIdentificacion: false }); this.error = null; }
          });
      });

  }

  save(): void {
    if (!this.personaForm.valid) { return; }
    this.spinner.show();
    const personaAltered: Persona = this.personaForm.getRawValue();
    delete personaAltered.id;
    delete personaAltered.edad;
    delete personaAltered.edadExacta;
    delete personaAltered.updatepersona;
    // delete personaAltered.telefono;
    delete personaAltered.redServicio;
    personaAltered.controlRegistro = this.createControlRegistro();
    //
    const datePipe = new DatePipe('en-US');
    personaAltered.fechaNacimiento = datePipe.transform(personaAltered.fechaNacimiento, 'yyyy-MM-dd', 'GMT-0600', 'es-NI');
    this.apiPersona.guardar(personaAltered).subscribe(
      {
        next: (r: any) => {
          if (r instanceof Array) {
            Swal.fire('Se creó el registro de Persona exitosamente, favor de crear la captación', 'Registro exitoso', 'success');
            this.showActionsAddPerson = false;
            this.showCaptacionStep.emit(true);
            this.apiPersona.personSelected$.next(r[0]);
            this.personaForm.disable();
            this.personaForm.get(['edad']).patchValue(r[0].edad);
            this.evaluateExactAge();
          } else {
            Swal.fire(r, 'Registro fallido', 'error');
            this.showActionsAddPerson = true;
            this.showCaptacionStep.emit(false);
          }
        },
        error: (e: HttpErrorResponse) => { this.spinner.hide(); Swal.fire(e.message, 'Petición fallida', 'error'); },
        complete: () => {
          this.spinner.hide();
        }
      }
    );
  }

  cancel(): void {
    this.personaForm.reset();
    this.router.navigate(['/captacion']);
  }

  createControlRegistro(): ControlRegistro {
    return {
      registro: {
        usuario: {
          nombre: this.apiPersona.getLocalStorageItem('userObj').username
        },
        sistema: {
          id: this.apiPersona.getLocalStorageItem(SYSTEM).id
        },
        unidad: {
          id: this.personaForm.get(['redServicio', 'residencia', 'unidadSalud', 'id']).value
        }
      }
    };
  }

  sendPerson(): void {
    this.personaForm.get(['direcciondomicilio'])
      .setValue(this.personaForm.get(['divisionPolitica', 'residencia', 'personaDireccion']).value);
    this.apiPersona.personSelected$.next(this.personaForm.getRawValue());
    if (this.infoResidenceIncomplete && this.personaForm.valid) {
      this.infoResidenceIncomplete = true;
      this.showCaptacionStep.emit(true);
    }
  }

  allowEdit(valueToggle: MatSlideToggleChange): void {
    if (!valueToggle) { return; }
    if (valueToggle.checked) {
      this.personaForm.get(['divisionPolitica', 'residencia']).enable();
      this.personaForm.get(['divisionPolitica', 'residencia', 'distrito']).disable();
    }
  }

  copyContent(inputELement: any, name: string): void {
    alert(`${name} copiado!`);
    inputELement.disabled = false;
    inputELement.select();
    document.execCommand('copy');
    inputELement.setSelectionRange(0, 0);
    inputELement.disabled = true;
  }

  validateIdentificacion(): void {
    if (this.personaForm.get(['identificacion', 'codigo']).value === 'NA') {
      this.personaForm.get(['identificacion', 'valor']).clearValidators();
      this.personaForm.get(['identificacion', 'valor']).updateValueAndValidity();
      this.personaForm.get(['identificacion', 'valor']).disable();
    } else {
      if (this.personaForm.get(['id']).value > 0) {
        this.personaForm.get(['identificacion', 'valor']).disable();
        this.personaForm.get(['identificacion', 'valor']).setValidators([Validators.required]);
        this.personaForm.get(['identificacion', 'valor']).updateValueAndValidity();
      } else {
        this.personaForm.get(['identificacion', 'valor']).enable();
        this.personaForm.get(['identificacion', 'valor']).setValidators([Validators.required]);
        this.personaForm.get(['identificacion', 'valor']).updateValueAndValidity();
      }

    }
  }

  validateExpandPanel(): boolean {
    if (this.personaForm.value) {
      if (this.personaForm.get(['id']).value >= 1) {
        if (this.personaForm.get(['paciente', 'precargado']).value) {
          return true;
        } else { return false; }

      } else { return true; }
    }
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    this.apiPersona.allowCreatePerson$.next(null);
    this.apiPersona.personSelected$.next(null);
    this.subject$.next();
    this.subject$.complete();
  }

}
