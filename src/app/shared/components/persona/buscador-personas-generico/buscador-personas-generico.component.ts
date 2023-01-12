import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  PacienteService,
  PersonaService,
} from 'src/app/services/service.index';
import {
  PersonaMinsa,
  Paginacion,
} from 'src/app/shared/models/minsa-personal/minsaPersonal.models';
import {
  Persona,
  ResponseBodyRequest,
} from 'src/app/shared/models/persona/persona.models';
import { ErrorDetail } from 'src/app/shared/models/util/error-detail';
import { DialogoContactoPacienteComponent } from '../../dialogo-contacto-paciente/dialogo-contacto-paciente.component';
import { DialogoPersonaComponent } from '../dialogo-persona/dialogo-persona.component';
import {
  LOOKUP_IDENTIFICACION,
  LOOKUP_NAMES,
  PATTERN_PRIMER_NOMBRE_APELLIDO,
  PATTERN_SEGUNDO_NOMBRE_APELLIDO,
} from '../persona.const';

@Component({
  selector: 'app-buscador-personas-generico',
  templateUrl: './buscador-personas-generico.component.html',
  styleUrls: ['./buscador-personas-generico.component.scss'],
})
export class BuscadorPersonasGenericoComponent implements OnInit, OnDestroy {
  /*Variables locales*/
  mostrarPrimero = true;
  mostrarDespues = false;
  searchForm: FormGroup;
  @Output('result') result: EventEmitter<PersonaMinsa[]> = new EventEmitter();
  @Output('paginacion')
  paginacion: EventEmitter<Paginacion> = new EventEmitter();
  @Output('showDialog') showDialog: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('identificacion', { static: false }) identificacion: ElementRef;
  @ViewChild('pApellido', { static: false }) pApellido: ElementRef;
  public contactoSelected$: BehaviorSubject<PersonaMinsa> = new BehaviorSubject<any>(
    ''
  );
  private subscription$: Subscription;
  @Input('allowCreatePerson') allowCreatePerson: boolean = false;

  /*Variables locales */

  public error: ErrorDetail;

  constructor(
    private api: PersonaService,
    private apiPaciente: PacienteService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscadorPersonasGenericoComponent>
  ) {
    // Instanciando formularios reactivos
    this.searchForm = this.formBuilder.group({
      typeLookUp: [LOOKUP_IDENTIFICACION, [Validators.required]],
      identificacion: this.formBuilder.group({
        valor: [null],
      }),
      primerNombre: [null, []],
      segundoNombre: [null, []],
      primerApellido: [null, []],
      segundoApellido: [null, []],
    });
  }
  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.identificacion.nativeElement.focus();
    });
  }

  controlHasError(
    nameValidator: string,
    frm: FormControl | FormGroup,
    controlName: string[]
  ): boolean | void {
    if (!controlName) {
      return;
    }
    switch (controlName.length) {
      case 0:
        return frm.hasError(nameValidator);
      default:
        if (frm.get(controlName)) {
          return (
            frm.hasError(nameValidator, controlName) &&
            frm.get(controlName).touched
          );
        } else {
          return;
        }
    }
  }

  manejaEsconder() {
    if (this.mostrarPrimero === true && this.mostrarDespues === false) {
      this.mostrarPrimero = !true;
      this.mostrarDespues = !false;
      this.searchForm.get(['typeLookUp']).setValue(LOOKUP_NAMES);
    } else {
      this.mostrarPrimero = true;
      this.mostrarDespues = false;
    }
  }

  cancelar() {
    this.resetFormSearch();
    this.manejaEsconder();
  }

  cancelarBuscar() {
    this.dialogRef.close();
  }

  onBackspaceKeydown(evento: any) {
    this.searchForm.get(['typeLookUp']).setValue(LOOKUP_NAMES);
    this.searchForm
      .get(['primerNombre'])
      .setValue(this.searchForm.get(['identificacion', 'valor']).value);
    this.searchForm.get(['identificacion', 'valor']).reset();
    this.mostrarDespues = true;
    this.mostrarPrimero = false;
    this.assignValidatorsDynamic();
  }

  assignValidatorsDynamic() {
    this.searchForm
      .get(['primerNombre'])
      .setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO),
      ]);
    this.searchForm
      .get(['primerApellido'])
      .setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO),
      ]);
    this.searchForm
      .get(['segundoNombre'])
      .setValidators([
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO),
      ]);
    this.searchForm
      .get(['segundoApellido'])
      .setValidators([
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO),
      ]);
    this.searchForm.updateValueAndValidity();
    setTimeout(() => {
      this.pApellido.nativeElement.focus();
    });
  }

  findPerson() {
    if (!this.searchForm.valid) {
      return false;
    }
    this.spinner.show();
    const criteria: ResponseBodyRequest = {
      datos: this.searchForm.getRawValue(),
    };
    switch (criteria.datos.typeLookUp) {
      case LOOKUP_NAMES:
        delete criteria.datos.typeLookUp;
        delete criteria.datos.identificacion;
        break;

      default:
        if (!criteria.datos.identificacion.valor) {
          this.spinner.hide();
          //Swal("Información Incompleta","Para realizar búsquedas, se requiere como mínimo número de identificación o código de expediente","error");
          return;
        }
        if (
          criteria.datos.identificacion.valor.trim().indexOf(' ') &&
          criteria.datos.identificacion.valor.trim().indexOf(' ') > 0
        ) {
          this.spinner.hide();
          //Swal("Parámetro incorrecto", "Debes cambiar al tipo de búsqueda por Nombres","warning");
          this.onBackspaceKeydown(null);
          this.searchForm.get(['primerNombre']).setValue('');
          return;
        }
        delete criteria.paginacion;
        delete criteria.datos.typeLookUp;
        delete criteria.datos.primerNombre;
        delete criteria.datos.segundoNombre;
        delete criteria.datos.primerApellido;
        delete criteria.datos.segundoApellido;
        break;
    }
    if (!this.executeFind()) {
      this.spinner.hide();
      return;
    }
    let messageError: string;
    let coincidencias: PersonaMinsa[];
    let paginacion: Paginacion;
    this.subscription$ = this.api.searchAdvanced(criteria).subscribe({
      next: (r: any) => {
        if (r.data) {
          if (r.paginacion) {
            paginacion = r.paginacion;
          }
          coincidencias = r.data;
        } else {
          messageError = r;
        }
      },
      error: (e: HttpErrorResponse) => (messageError = e.message),
      complete: () => {
        this.spinner.hide();
        if (coincidencias) {
          this.abrirTablaResultados(coincidencias);
          this.result.emit(coincidencias);
          if (paginacion) {
            if (paginacion.paginasPendientes >= 0) {
              this.paginacion.emit(paginacion);
              this.api.criteriaLookUp$.next(criteria);
            }
            // this.paginacion.emit(paginacion);
          } else {
            this.api.criteriaLookUp$.next(null);
          }
        } else {
          this.assignErrorForDialog(messageError);
        }
      },
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

  abrirTablaResultados(resultados: PersonaMinsa[]) {
    let datos: PersonaMinsa;
    if (!resultados) {
      return;
    }
    var dialogRef: any;
    dialogRef = this.dialog.open(DialogoPersonaComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      hasBackdrop: true,
      data: { resultados },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        datos = data;
        this.apiPaciente.setContactoSeleccionado(datos);
        this.dialogRef.close(datos);
      } else {
      }
    });
  }

  assignErrorForDialog(messageError: string) {
    this.error = {
      title: 'Resultados de búsqueda',
      message: messageError,
      buttons: [
        {
          code: 'CP',
          name: 'Crear Contacto',
          //disabled: !this.allowCreatePerson,
          disabled: false,
          color: 'primary',
          icon: { name: 'add' },
        },
        {
          code: 'RB',
          name: 'Reintentar',
          disabled: false,
          color: 'accent',
          icon: { name: 'refresh' },
        },
      ],
    };
  }

  captureAction(codeAction: string): void {
    if (!codeAction) {
      return;
    }
    switch (codeAction) {
      case 'RB':
        this.resetFormSearch();
        this.manejaEsconder();
        break;
      case 'CP':
        if (!this.allowCreatePerson) {
          //Swal('Privilegios insuficientes', 'Lo sentimos pero NO tienes los privilegios para realizar esta acción, favor contacte al administrador del sistema', 'error');
          return;
        }
        this.api.allowCreatePerson$.next(true);
        this.showDialog.emit(true);
        break;
      default:
        break;
    }
  }
  resetFormSearch() {
    const criteria: {
      typeLookUp: string;
      identificacion: { valor: string };
      primerNombre: string;
      segundoNombre: string;
      primerApellido: string;
      segundoApellido: string;
    } = {
      typeLookUp: LOOKUP_IDENTIFICACION,
      identificacion: { valor: null },
      primerNombre: null,
      segundoNombre: null,
      primerApellido: null,
      segundoApellido: null,
    };
    this.error = null;
    this.searchForm.reset(criteria);
    this.searchForm.get(['primerNombre']).clearValidators();
    this.searchForm.get(['primerApellido']).clearValidators();
    this.searchForm.get(['primerNombre']).updateValueAndValidity();
    this.searchForm.get(['primerApellido']).updateValueAndValidity();
    this.searchForm.markAsPristine();
    setTimeout(() => {
      if (this.identificacion) {
        if (this.identificacion.nativeElement) {
          this.identificacion.nativeElement.focus();
        }
      }
    });
  }

  executeFind(): boolean {
    const criteria: ResponseBodyRequest = {
      datos: this.searchForm.getRawValue(),
    };
    switch (criteria.datos.typeLookUp) {
      case LOOKUP_NAMES:
        if (!criteria.datos.primerNombre || !criteria.datos.primerApellido) {
          return false;
        }
        return true;

      case LOOKUP_IDENTIFICACION:
        if (!criteria.datos.identificacion.valor) {
          return false;
        }
        return true;

      default:
        return false;
    }
  }
}
