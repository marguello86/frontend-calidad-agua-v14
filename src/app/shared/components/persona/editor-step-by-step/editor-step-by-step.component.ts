import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { MatDatepickerInputEvent, MatDialogRef, MatStepper, MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { delay, retry, takeUntil } from 'rxjs/operators';
import { PersonaService, SbcCatEntidadesService } from 'src/app/services/service.index';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { Configuracionidentificacion, Identificacion } from 'src/app/shared/models/persona/persona.models';
import Swal from 'sweetalert2';
import { SbcCatColectivosComboComponent } from '../../catalogos/sbc-cat-colectivos-combo/sbc-cat-colectivos-combo.component';
import { SbcCatEntidadesComboComponent } from '../../catalogos/sbc-cat-entidades-combo/sbc-cat-entidades-combo.component';
import {
  NICARAGUA_CODE_ALFADOS, NICARAGUA_CODE_ALFATRES, NICARAGUA_V1, NICARAGUA_V2, NO_APLICA,
  PERSONA_IDENTIFICADA, PERSONA_NO_IDENTIFICADA, TODAY, CANCEL, NEXT, PATTERN_SEGUNDO_NOMBRE_APELLIDO, PATTERN_PRIMER_NOMBRE_APELLIDO
} from '../persona.const';

@Component({
  selector: 'app-editor-step-by-step',
  templateUrl: './editor-step-by-step.component.html',
  styleUrls: ['./editor-step-by-step.component.scss']
})
export class EditorStepByStepComponent implements OnInit, OnDestroy {
  public personaFormGroup: FormGroup;
  public show: boolean = false;
  public isForeign: boolean = true;
  startDate: Date = new Date();
  maxDate: Date = TODAY;
  public msgErrorCoincidence: string = '';
  public showNextDataGral: boolean = false;
  public identificacionesPermitidas: Identificacion[];
  public codeIdentificaciones: string;
  public maxLengthNumIdentificacion: number = 50;
  public requestNumIdentificacion: boolean = true;

  private subject$: Subject<void> = new Subject();
  private fechaNacimiento: Date;

  @ViewChild('municipioBorn', { static: false }) municipioBorn: SbcCatEntidadesComboComponent;
  @ViewChild('tipoIdentificacion', { static: false }) tipoIdentificacion: SbcCatColectivosComboComponent;

  constructor(private _formBuilder: FormBuilder, private router: Router,
    private dialogRef: MatDialogRef<EditorStepByStepComponent>,
    private catalogosService: SbcCatEntidadesService,
    private apiPersona: PersonaService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.personaFormGroup = this._formBuilder.group({
      id: new FormControl(''),
      tipoPersona: new FormControl('', [Validators.required]),
      identificacion: this._formBuilder.group({
        id: [''],
        codigo: [''],
        valor: [''],
      }),
      primerNombre: ['', [Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]],
      segundoNombre: ['', [Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]],
      primerApellido: ['', [Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]],
      segundoApellido: ['', [Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]],
      sexo: this._formBuilder.group({
        id: [''],
        codigo: [''],
        valor: ['']
      }),
      fechaNacimiento: [''],
      divisionPolitica: this._formBuilder.group({
        nacimiento: this._formBuilder.group({
          municipio: this._formBuilder.group({
            id: [null],
            nombre: [''],
            codigocsereg: [null]
          }),
          departamento: this._formBuilder.group({
            id: [null],
            nombre: [''],
          }),
          region: this._formBuilder.group({
            id: [null],
            nombre: [''],
          }),
          pais: this._formBuilder.group({
            id: [null],
            nombre: [''],
          })
        })
      }),
    });
  }

  captureEventNext(stepper: MatStepper, code?: string) {
    if (code) {
      this.personaFormGroup.clearAsyncValidators();
      this.personaFormGroup.updateValueAndValidity();
      this.personaFormGroup.get(['tipoPersona']).patchValue(code);
      this.personaFormGroup.get(['tipoPersona']).setValidators([Validators.required]);
      this.personaFormGroup.get(['tipoPersona']).updateValueAndValidity();
    }
    stepper.next();
    this.assignFormsValidators(code);
  }

  resetStepper(stepper: MatStepper) {
    this.resetFormsSpecific(this.personaFormGroup);
    this.personaFormGroup.clearValidators();
    this.personaFormGroup.get(['tipoPersona']).setValidators([Validators.required]);
    this.personaFormGroup.updateValueAndValidity();
  }

  assignFormsValidators(typePerson: string) {
    if (!typePerson) { return; }
    switch (typePerson) {
      case 'IDNT':
        this.personaFormGroup.get(['divisionPolitica', 'nacimiento', 'pais', 'id']).setValidators([Validators.required]);
        this.personaFormGroup.updateValueAndValidity();
        break;

      default:
        break;
    }
  }


  countryBornSelected(country: any) {
    if (!country) { return; }
    this.spinner.show();
    this.showNextDataGral = false;
    if (country.codigoalfados.toUpperCase() === NICARAGUA_CODE_ALFADOS &&
      country.codigoalfatres.toUpperCase() === NICARAGUA_CODE_ALFATRES &&
      (country.nombre.toUpperCase() === NICARAGUA_V1 || country.nombre.toUpperCase() === NICARAGUA_V2)) {
      this.isForeign = false;
    } else { this.isForeign = true; }
    this.validateConfigIdentificaciones(country);

    /*
    this.personaFormGroup.get(['primerNombre']).setValidators(Validators.required);
    this.personaFormGroup.get(['primerNombre']).updateValueAndValidity();
    this.personaFormGroup.get(['primerApellido']).setValidators([Validators.required]);
    this.personaFormGroup.get(['sexo', 'id']).setValidators([Validators.required]);
    this.personaFormGroup.get(['fechaNacimiento']).setValidators([Validators.required]);
    */
  }

  validateConfigIdentificaciones(country: any): void {
    if (this.tipoIdentificacion) { this.tipoIdentificacion.ngOnDestroy(); }
    this.codeIdentificaciones = null;
    this.catalogosService.obtenerPorId('gestion-catalogos/configuracionidentificacion/pais', country.id)
      .pipe(takeUntil(this.subject$), retry(5))
      .subscribe({
        next: r => {
          if (!r.error) {
            const a: any[] = r.data;
            if (this.identificacionesPermitidas) { this.identificacionesPermitidas = null; }
            this.identificacionesPermitidas = a.filter((b: Identificacion) => {
              if (!b.pasivo) {
                b.configuracionidentificacion = b.configuracionidentificacion
                  .filter((c: Configuracionidentificacion) => c.pasivo === false);
                if (b.configuracionidentificacion.length > 0) {
                  return b;
                }
              }
            });
          }
        },
        error: (e: HttpErrorResponse) => {
          this.spinner.hide();
          Swal.fire('No hemos podido obtener las identificaciones válidas para el país ' + country.nombre
            , e.message, 'error');
        },
        complete: () => {
          this.spinner.hide();
          if (this.identificacionesPermitidas) {
            const codes = (n: Identificacion[]): string => {
              const z: Array<string> = n.map(x => x.codigo);
              return z.toString();
            };
            this.codeIdentificaciones = codes(this.identificacionesPermitidas);
            this.showNextDataGral = true;
          }
        }
      });
  }


  updateMunicipioBorn(deparment: any): void {
    if (this.isForeign) { return; }
    if (!this.municipioBorn) { return; }
    const vid = (deparment ? deparment.id || deparment : 0);
    this.municipioBorn.actualizarPorReferencia('departamento', vid);
    if (+vid > 0) {
      if (!this.personaFormGroup.get('divisionPolitica').get(['nacimiento', 'departamento']).pristine) {
        this.resetFormsSpecific(this.personaFormGroup.get(['divisionPolitica', 'nacimiento', 'municipio']));
        // this.personaForm.get('divisionPolitica').get('nacimiento').get('municipio').reset();
        // this.personaForm.get('divisionPolitica').get('nacimiento').get('municipio').markAsPristine();
      }
    }
    // this._changeDetector.detectChanges();

  }

  municipioBornSelected(locality: any): void {
    if (!locality) { return; }
  }

  private resetFormsSpecific(typeForm: any): void {
    if (!typeForm) { return; }
    typeForm.reset();
    typeForm.markAsPristine();
  }

  typeIdentificacionSelected(idn: Catalogo) {
    if (!idn) { return; }
    if (idn.codigo === NO_APLICA) {
      this.personaFormGroup.get(['identificacion', 'valor']).setValue(null);
      this.personaFormGroup.get(['identificacion', 'valor']).disable();
    } else { this.personaFormGroup.get(['identificacion', 'valor']).enable(); }
    this.personaFormGroup.get(['identificacion', 'codigo']).setValue(idn.codigo);
    this.validateConfigurationIdentificaionSelected(idn);
    if (idn.codigo === 'CED' && !this.isForeign) {
      this.validateCedulaNicaragua();
    }
  }

  validateConfigurationIdentificaionSelected(idn: Catalogo) {
    if (!idn) { return; }
    const regExq = this.identificacionesPermitidas
      .filter((b: Identificacion) => b.codigo === idn.codigo)[0].configuracionidentificacion[0].mascara;
    const minLength: number = this.identificacionesPermitidas
      .filter((b: Identificacion) => b.codigo === idn.codigo)[0].configuracionidentificacion[0].longitudminima;
    const maxLength: number = this.identificacionesPermitidas
      .filter((b: Identificacion) => b.codigo === idn.codigo)[0].configuracionidentificacion[0].longitudmaxima;
    switch (this.identificacionesPermitidas
      .filter((b: Identificacion) => b.codigo === idn.codigo)[0].configuracionidentificacion[0].identificacionvalida) {
      case false:
        this.personaFormGroup.get(['tipoPersona']).setValue(PERSONA_NO_IDENTIFICADA);
        break;
      default:
        this.personaFormGroup.get(['tipoPersona']).setValue(PERSONA_IDENTIFICADA);
        break;
    }

    if (minLength) {
      this.personaFormGroup.get(['identificacion', 'valor']).setValidators([Validators.minLength(minLength)]);
    } else { this.personaFormGroup.get(['identificacion', 'valor']).setValidators([Validators.pattern(regExq)]); }
    if (maxLength) {
      this.maxLengthNumIdentificacion = maxLength;
      this.personaFormGroup.get(['identificacion', 'valor']).setValidators([Validators.maxLength(this.maxLengthNumIdentificacion)]);
    } else {
      this.maxLengthNumIdentificacion = 50;
      this.personaFormGroup.get(['identificacion', 'valor']).setValidators([Validators.pattern(regExq)]);
    }
    if (regExq) {
      this.personaFormGroup.get(['identificacion', 'valor']).setValidators([Validators.pattern(regExq)]);
    } else { this.personaFormGroup.get(['identificacion', 'valor']).setValidators([Validators.pattern(regExq)]); }
    if (regExq || minLength || maxLength) { this.personaFormGroup.get(['identificacion', 'valor']).updateValueAndValidity(); }
  }

  typeGenderSelected(gender: Catalogo): void {
    if (!gender) { return; }
    this.personaFormGroup.get(['sexo', 'codigo']).setValue(gender.codigo);
    this.personaFormGroup.get(['sexo', 'valor']).setValue(gender.valor);
  }

  dateChangeEvent(dateChange: MatDatepickerInputEvent<any>): void {
    this.fechaNacimiento = dateChange.value;
  }

  validateCedulaNicaragua() {
    this.personaFormGroup.get(['identificacion', 'valor']).valueChanges.pipe(delay(3000))
      .subscribe(
        cni => {
          if (!this.apiPersona.validateCedulaNicaragua(cni,
            this.personaFormGroup.get(['divisionPolitica', 'nacimiento', 'municipio', 'codigocsereg']).value, null)) {
            this.personaFormGroup.get(['identificacion', 'valor']).setErrors({ cedulaInvalida: true });
          } else { this.personaFormGroup.get(['identificacion', 'valor']).setErrors({ cedulaInvalida: false }); }

        }
      );
  }


  close(typeClose: string) {
    if (!typeClose) { return; }
    switch (typeClose) {
      case CANCEL:
        this.dialogRef.close();
        break;
      case NEXT:
        const datePipe = new DatePipe('en-US');
        this.personaFormGroup.get('fechaNacimiento')
          .patchValue(datePipe.transform(this.fechaNacimiento, 'yyyy-MM-dd', 'GMT-0600', 'es-NI'));
        this.dialogRef.close(this.personaFormGroup.getRawValue());
        break;
      default:
        break;
    }

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


  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }

}
