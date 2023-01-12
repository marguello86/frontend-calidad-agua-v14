import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, Subscription } from 'rxjs';
import { PersonaService } from 'src/app/services/service.index';
import { PersonalMinsaService } from 'src/app/services/personalMedico/personal-medico.service';
import { Paginacion, Persona, ResponseBodyRequest, DataRequest, TipoBusqueda } from 'src/app/shared/models/persona/persona.models';
import { Respuesta, DatosDeEnvio } from 'src/app/shared/models/minsa-personal/minsaPersonal.models';
import { ErrorDetail } from 'src/app/shared/models/util/error-detail';
import { LOOKUP_IDENTIFICACION, LOOKUP_NAMES, PATTERN_PRIMER_NOMBRE_APELLIDO, PATTERN_SEGUNDO_NOMBRE_APELLIDO } from '../persona.const';
import Swal from 'sweetalert2';
//import {  MatDialogRef, MatInput, MAT_DIALOG_DATA } from '@angular/material';
import { DialogoPersonaComponent } from '../dialogo-persona/dialogo-persona.component';
import { inject } from '@angular/core/testing';
import { DialogoAsignarUnidadComponent } from '../../dialogo-asignar-unidad/dialogo-asignar-unidad.component';
//import { AdmisionComponent } from 'src/app/pages/admision/admision.component';
import { distinctUntilChanged, first, takeUntil } from 'rxjs/operators';
import { RespuestaRetorno } from './respuesta';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-buscador-personas',
  templateUrl: './buscador-personas.component.html',
  styleUrls: ['./buscador-personas.component.scss'],
  //providers: [AdmisionComponent]
})
export class BuscadorPersonasComponent implements OnInit, AfterViewInit, OnDestroy {
  /*Variables locales*/
  public mostrarPrimero = true;
  public mostrarDespues = false;
  public searchForm: FormGroup;
  public datosEnvio: DatosDeEnvio;
  public respuesta: Respuesta;
  private subject$: Subject<void> = new Subject();
  private subscription$: Subscription;
  private busquedaSubscription$: Subscription;
  public error: ErrorDetail;
  public etiqueta: string;
  public soloEscritura: boolean = false;
  public busqueda: TipoBusqueda;
  public referencia1: string;
  public referencia2: string;
  public referencia3: string;
  public referencia4: string;
  private respuestaRetorno: RespuestaRetorno;

  @Input('allowCreatePerson') allowCreatePerson: boolean = false;
  @Input('parametrosBusqueda') parametrosBusqueda: TipoBusqueda = {};
  @Input('setPersonaBuscada') setPersonaBuscada: TipoBusqueda = {};
  @Input('busquedaPorTipo') busquedaPorTipo: string = 'persona';
  @Output('result') Resultado: EventEmitter<Persona[]> = new EventEmitter();
  @Output('paginacion') paginacion: EventEmitter<Paginacion> = new EventEmitter();
  @Output('showDialog') showDialog: EventEmitter<boolean> = new EventEmitter();
  @Output('resetCheck') resetCheck: EventEmitter<boolean> = new EventEmitter();
  @Output() cancelarEvento: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('identificacion', { static: false }) identificacion: ElementRef;
  @ViewChild('pApellido', { static: true }) pApellido: ElementRef;
  @ViewChild('pNombre', { static: true }) pNombre: ElementRef;
  /*Variables locales */

  //public error: ErrorDetail;

  constructor(
    private api: PersonaService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private mPersonal: PersonalMinsaService,
    private dialogo: MatDialog,
    //private admision: AdmisionComponent
  ) {
    // Instanciando formularios reactivos
    this.searchForm = this.formBuilder.group({
      typeLookUp: [LOOKUP_IDENTIFICACION, [Validators.required]],
      identificacion: this.formBuilder.group({
        valor: [null]
      }),
      primerNombre: [null, []],
      segundoNombre: [null, []],
      primerApellido: [null, []],
      segundoApellido: [null, []],
    });
  }

  ngOnInit() {
    //debugger;
    this.etiqueta = this.busquedaPorTipo === 'persona' ? 'Número de identificación, número expediente único, Nombre completo' : 'Número de identificación, código minsa, Nombre completo';
  }
  resetearElemento() {
    //debugger
    this.searchForm.reset();
    this.cancelar(this.InitRespuestaRetorno());
    this.cancelar(this.InitRespuestaRetorno());
    this.manejaEsconder();
  }
  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.identificacion.nativeElement.focus();
    // });
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

  cancelar(data: any) {
    //debugger;
    this.resetFormSearch();
    this.manejaEsconder();
    this.cancelarEvento.emit(data);
    //this.setearNuevoValor();
  }

  setearNuevoValor() {
    //debugger;
    if (this.busqueda) {
      if (this.busqueda.esRecienNacido || this.busqueda.esDesconocido) {
        let objeto = this.busqueda;
        let creaPersona: {};
        if (objeto.creacionPersona) {
          creaPersona = {
            persona: objeto.creacionPersona.persona,
            recienNacido: objeto.creacionPersona.recienNacido,
            identificada: objeto.creacionPersona.identificada,
            desconocido: objeto.creacionPersona.desconocido
          }
        }
        this.busqueda = {
          esRecienNacido: objeto.esRecienNacido,
          esDesconocido: objeto.esDesconocido,
          esNoIdentificado: objeto.esNoIdentificado,
          cancelar: true,
          creacionPersona: (creaPersona || '')
        }
      }
    }
  }

  onBackspaceKeydown(evento: any) {
    //debugger;
    this.searchForm.get(['typeLookUp']).setValue(LOOKUP_NAMES);
    this.searchForm.get(['primerNombre'])
      .setValue(this.searchForm.get(['identificacion', 'valor']).value);
    this.searchForm.get(['identificacion', 'valor']).reset();
    this.mostrarDespues = true;
    this.mostrarPrimero = false;
    this.assignValidatorsDynamic();
  }

  assignValidatorsDynamic() {
    //debugger;
    if (this.busqueda.esRecienNacido) {
      this.searchForm.get(['primerNombre']).setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(50),
      Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]);
      this.searchForm.get(['primerApellido']).setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(50)]);
      this.searchForm.get(['segundoNombre']).setValidators([Validators.minLength(2), Validators.maxLength(50)]);
      this.searchForm.get(['segundoApellido']).setValidators([Validators.minLength(2), Validators.maxLength(50),
      Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]);
      this.searchForm.updateValueAndValidity();

    } else {
      this.searchForm.get(['primerNombre']).setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(50),
      Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]);
      this.searchForm.get(['primerApellido']).setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(50),
      Validators.pattern(PATTERN_PRIMER_NOMBRE_APELLIDO)]);
      this.searchForm.get(['segundoNombre']).setValidators([Validators.minLength(2), Validators.maxLength(50),
      Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]);
      this.searchForm.get(['segundoApellido']).setValidators([Validators.minLength(2), Validators.maxLength(50),
      Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]);
      this.searchForm.updateValueAndValidity();
    }
    // setTimeout(() => {
    //   this.pApellido.nativeElement.focus();
    // });
  }

  findPerson() {
    //debugger;
    if (!this.searchForm.valid) { return false; }
    this.spinner.show();
    const criteria: ResponseBodyRequest = {
      datos: this.searchForm.getRawValue(),
      paginacion: {
        pagina: 1,
        paginaRegistros: 100,
      }
    };
    switch (criteria.datos.typeLookUp) {
      case LOOKUP_NAMES:
        delete criteria.datos.typeLookUp;
        delete criteria.datos.identificacion;
        //* ESTABLECE LOS VALORES PARA EL ENVIO DE LOS DATOS AL PERSONAL MINSA
        this.datosEnvio = {
          primernombre: criteria.datos.primerNombre,
          segundonombre: criteria.datos.segundoNombre,
          primerapellido: criteria.datos.primerApellido,
          segundoapellido: criteria.datos.segundoApellido,
          pagactual: 1,
          pagscantidad: 100,
          tipofiltro: 2
        };
        //* SE ELIMINA LOS DATOS QUE NO SE OCUPARAN
        delete this.datosEnvio.identificacion;
        break;

      default:
        if (!criteria.datos.identificacion.valor) {
          this.spinner.hide();
          Swal.fire('Información Incompleta', 'Para realizar búsquedas, se requiere como mínimo número de identificación o código de expediente',
            'error');
          return;
        }
        if (criteria.datos.identificacion.valor.trim().indexOf(' ') &&
          criteria.datos.identificacion.valor.trim().indexOf(' ') > 0) {
          this.spinner.hide();
          Swal.fire('Parámetro incorrecto', 'Debes cambiar al tipo de búsqueda por Nombres',
            'warning');
          this.onBackspaceKeydown(null);
          this.searchForm.get(['primerNombre'])
            .setValue('');
          return;
        }
        //* SE ESTABLECE LOS DATOS PARA EL EVIO POR CEDULA / IDPERSONAL
        this.datosEnvio = {
          identificacion: criteria.datos.identificacion.valor,
          pagactual: 1,
          pagscantidad: 100,
          tipofiltro: 1
        };
        delete this.datosEnvio.primernombre;
        delete this.datosEnvio.primerapellido;
        delete this.datosEnvio.segundonombre;
        delete this.datosEnvio.segundoapellido;


        //* SE ELIMINA LOS DATOS QUE NO ENVIAN A LA API
        delete criteria.paginacion;
        delete criteria.datos.typeLookUp;
        delete criteria.datos.primerNombre;
        delete criteria.datos.segundoNombre;
        delete criteria.datos.primerApellido;
        delete criteria.datos.segundoApellido;
        break;
    }
    if (!this.executeFind()) { this.spinner.hide(); return; }
    if (this.busquedaPorTipo) {
      switch (this.busquedaPorTipo) {
        case "minsaPersonal":
        case "apertura":
          this.ObtenerPersonalMinsa(this.datosEnvio, criteria);
          break;
        case "persona":
          this.ObtenerPersona(criteria);
          break;
      }
    }
  }

  //* OBTENER PERSONAL MINSA
   ObtenerPersonalMinsa(objeto: DatosDeEnvio, criteria: any) {
    //debugger;
     let messageError: string;
     let coincidencias: Persona[];
     let paginacion: Paginacion;
     this.subscription$ = this.api.BusquedaPersonalMinsa(objeto).subscribe({
       next: (r: any) => {
         //debugger;
         if (r.data) {
           if (r.paginacion) {
             paginacion = r.paginacion;
           }
           coincidencias = r.data;
         } else { messageError = r.message; }
      },
       error: (e: HttpErrorResponse) => messageError = e.message,
       complete: () => {
         //debugger;
         this.spinner.hide();
         if (coincidencias) {
           this.Resultado.emit(coincidencias);
           if (paginacion) {
             if (paginacion.paginasPendientes >= 0) {
              this.paginacion.emit(paginacion);
               this.api.criteriaLookUp$.next(criteria);
             }
             // this.paginacion.emit(paginacion);
         } else { this.api.criteriaLookUp$.next(null); }
         } else {
         Swal.fire('Resultados de la búsqueda', messageError, 'warning');
           //this.assignErrorForDialog(messageError);
         }
       }
     });

   }
  //* OBTIENE LA PERSONA
  ObtenerPersona(criteria: any) {
   // debugger;
    let messageError: string;
    let coincidencias: Persona[];
    let paginacion: Paginacion;
    this.subscription$ = this.api.searchAdvanced(criteria).subscribe({
      next: (r: any) => {
        if (r.data) {
          if (r.paginacion) {
            paginacion = r.paginacion;
          }
          coincidencias = r.data;
        } else { messageError = r; }
      },
      error: (e: HttpErrorResponse) => messageError = e.message,
      complete: () => {
        //debugger;
        this.spinner.hide();
        this.cancelar(this.InitRespuestaRetorno());
        this.setearNuevoValor();
        //this.resetearElemento();
        if (coincidencias) {
          this.Resultado.emit(coincidencias);

          if (paginacion) {
            if (paginacion.paginasPendientes >= 0) {
              this.paginacion.emit(paginacion);
              this.api.criteriaLookUp$.next(criteria);
            }
            // this.paginacion.emit(paginacion);
            this.MostrarDialogo(coincidencias);
          } else { this.api.criteriaLookUp$.next(null); }
        } else {
          this.MostrarDialogo(coincidencias);
        }
      }
    });
  }

  ResetFormulario() {
    this.searchForm.reset();
    this.cancelar(this.InitRespuestaRetorno());
  }

  assignErrorForDialog(messageError: string) {
    this.error = {
      title: 'Resultados de búsqueda',
      message: messageError,
      buttons: [{
        code: 'CP',
        name: 'Crear Persona',
        disabled: !this.allowCreatePerson,
        color: 'primary',
        icon: { name: 'add' }
      },
      {
        code: 'RB',
        name: 'Reintentar',
        disabled: false,
        color: 'accent',
        icon: { name: 'refresh' }
      }]
    };
  }

  captureAction(codeAction: string): void {
    if (!codeAction) { return; }
    switch (codeAction) {
      case 'RB':
        this.resetFormSearch();
        this.manejaEsconder();
        break;
      case 'CP':
        if (!this.allowCreatePerson) {
          Swal.fire('Privilegios insuficientes',
            'Lo sentimos pero NO tienes los privilegios para realizar esta acción, favor contacte al administrador del sistema', 'error');
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
      typeLookUp: string; identificacion: { valor: string };
      primerNombre: string; segundoNombre: string; primerApellido: string;
      segundoApellido: string;
    } = {
      typeLookUp: LOOKUP_IDENTIFICACION,
      identificacion: { valor: null },
      primerNombre: null,
      segundoNombre: null,
      primerApellido: null,
      segundoApellido: null
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
        if (this.identificacion.nativeElement) { this.identificacion.nativeElement.focus(); }
      }
    });
  }

  executeFind(): boolean {
    //debugger;
    const criteria: ResponseBodyRequest = { datos: this.searchForm.getRawValue() };
    switch (criteria.datos.typeLookUp) {
      case LOOKUP_NAMES:
        if (!criteria.datos.primerNombre || !criteria.datos.primerApellido) { return false; }
        return true;

      case LOOKUP_IDENTIFICACION:
        if (!criteria.datos.identificacion.valor) { return false; }
        return true;

      default:
        return false;
    }
  }


  MostrarDialogo(datos: Persona[]) {
    //debugger;
    let esRecienNacido: boolean = this.soloEscritura;
    this.dialogo.open(
      DialogoPersonaComponent,
      {
        width: '90%',
        height: '90%',
        data: {
          persona: datos,
          esRecienNacido: esRecienNacido,
          esDesconocido: false,
          personaBusqueda: this.busqueda
        },
        disableClose: true,
        backdropClass: 'oscurecer'
      }
    ).afterClosed()
      .subscribe((data: boolean) => {
        //debugger;
        if (data) {
          this.mostrarDespues = data['cancelar'];
          this.cancelar(data);
        }
      });
  }
  ngOnChanges(changes): void {
    //debugger;
    this.EstablecerTipoBusqueda(changes);
  }

  EstablecerTipoBusqueda(changes) {
    //debugger;
    if (changes["parametrosBusqueda"]) {
      if (this.parametrosBusqueda.esRecienNacido && !this.parametrosBusqueda.cancelar) {
        //this.cancelar();
        this.busqueda = this.parametrosBusqueda;
        this.soloEscritura = true;
        this.onBackspaceKeydown(true);
        this.searchForm.get(['primerNombre']).setValue('bebe');
        this.searchForm.get(['segundoNombre']).setValue('de');
        this.referencia1 = '';
        this.referencia2 = 'Nombres de la madre';
        this.referencia3 = '';
        this.referencia4 = 'Apellidos de la madre';
      }
      if (this.parametrosBusqueda.esDesconocido && !this.parametrosBusqueda.cancelar) {
        //this.cancelar();
        this.busqueda = this.parametrosBusqueda;
        this.onBackspaceKeydown(true);
        this.soloEscritura = false;
        this.searchForm.get(['primerNombre']).setValue('');
        this.searchForm.get(['segundoNombre']).setValue('');
      }
      if (this.parametrosBusqueda.esNoIdentificado && !this.parametrosBusqueda.cancelar) {
        //this.cancelar();
        this.busqueda = this.parametrosBusqueda;
        this.soloEscritura = false;
        this.referencia1 = 'Primer nombre';
        this.referencia2 = 'Primer apellido';
        this.referencia3 = 'Segundo nombre';
        this.referencia4 = 'Segundo apellido';
      }
    }
    if (changes['busquedaPorTipo']) {
      this.busqueda = {
        esRecienNacido: false
      }
      this.referencia1 = 'Primer nombre';
      this.referencia2 = 'Primer apellido';
      this.referencia3 = 'Segundo nombre';
      this.referencia4 = 'Segundo apellido';

    }
    if (changes['setPersonaBuscada']) {
      this.busqueda = this.setPersonaBuscada;
      if (this.busqueda['creacionPersona'] && !this.parametrosBusqueda.cancelar) {
        //debugger;
        if (this.busqueda.creacionPersona.persona) {
          this.referencia1 = 'Primer nombre';
          this.referencia2 = 'Primer apellido';
          this.referencia3 = 'Segundo nombre';
          this.referencia4 = 'Segundo apellido';
        }
      }
      this.cancelar(this.InitRespuestaRetorno());
      this.ResetFormulario();
    }
  }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
    if (this.busquedaSubscription$) { this.busquedaSubscription$.unsubscribe(); }
  }

  InitRespuestaRetorno(): RespuestaRetorno {
    this.respuestaRetorno = {
      cancelar: false,
      persona: null,
      mostrar: false,
    }
    return this.respuestaRetorno;
  }
}
