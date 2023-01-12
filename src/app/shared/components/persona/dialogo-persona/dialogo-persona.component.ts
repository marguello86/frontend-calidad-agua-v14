import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  Configuracionidentificacion,
  Identificacion,
  Persona,
  TipoBusqueda,
} from '../../../models/persona/persona.models';
import { MaestroDetallePersona } from '../dialogo-persona/maestro-detalle-persona';
import {
  PersonaService,
  SbcCatEntidadesService,
} from 'src/app/services/service.index';
import { ErrorDetail } from '../../../models/util/error-detail';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PATTERN_SEGUNDO_NOMBRE_APELLIDO } from '../../persona/persona.const';
import { Observable, Subject, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
//import { notificacion } from '../utility/notificaciones/notificacion';
import Swal from 'sweetalert2';
import { RespuestaRetorno } from '../../persona/buscador-personas/respuesta';
@Component({
  selector: 'app-dialogo-persona',
  templateUrl: './dialogo-persona.component.html',
  styleUrls: ['./dialogo-persona.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DialogoPersonaComponent implements AfterViewInit, OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public personaFormGroup: FormGroup;
  isOptional = false;

  private busqueda: TipoBusqueda;
  public personaBuscada: TipoBusqueda;
  public fila: MaestroDetallePersona;
  public expandedElement: MaestroDetallePersona[] = [];
  public dataSource: MatTableDataSource<MaestroDetallePersona>;
  public claseExpandir: string = 'fa fa-chevron-down';
  public mostrarMensaje: boolean = false;
  public mensajeError: string = '';
  mostrarTabs: boolean = false;
  public crearPersona: boolean = false;
  public showNextDataGral: boolean = false;
  public isForeign: boolean = true;
  public codeIdentificaciones: string;
  private subject$: Subject<void> = new Subject();
  public identificacionesPermitidas: Identificacion[];
  private suscripcionCheck$: Subscription;
  //public alerta: notificacion;
  public esFallecido: boolean = false;
  public error: ErrorDetail;
  private respuestaRetorno: RespuestaRetorno;

  columnsToDisplay = [
    'colapse',
    'identificacion',
    'codigoExpediente',
    'nombreCompleto',
    'departamento',
    'direccion',
    'opciones',
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Input('resetCheck') resetCheck: Observable<boolean>;
  @Input('datosBusqueda') datosBusqueda: Observable<boolean>;

  constructor(
    @Optional() private dialogo: MatDialogRef<DialogoPersonaComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialog
  ) {
    //SE MOSTRARA EL DETALLE DEL MISMO
  }
  //SE CREA EL FORMULARIO REACTIVO
  CrearFormulario() {
    this.personaFormGroup = this.formBuilder.group({
      id: new FormControl(''),
      tipoPersona: new FormControl('', [Validators.required]),
      identificacion: this.formBuilder.group({
        id: [''],
        codigo: [''],
        valor: [''],
      }),
      primerNombre: ['', [Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)]],
      segundoNombre: [
        '',
        [Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)],
      ],
      primerApellido: [
        '',
        [Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)],
      ],
      segundoApellido: [
        '',
        [Validators.pattern(PATTERN_SEGUNDO_NOMBRE_APELLIDO)],
      ],
      sexo: this.formBuilder.group({
        id: [''],
        codigo: [''],
        valor: [''],
      }),
      fechaNacimiento: [''],
      divisionPolitica: this.formBuilder.group({
        nacimiento: this.formBuilder.group({
          municipio: this.formBuilder.group({
            id: [null],
            nombre: [''],
            codigocsereg: [null],
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
          }),
        }),
      }),
    });
  }
  ngOnInit() {
    this.CrearFormulario();
    this.EstablecerDatosTabla();
    this.renderizaTablaPersonas();
  }

  assignErrorForDialog(messageError: string) {
    this.error = {
      title: 'Resultados de búsqueda',
      message: messageError,
      buttons: [
        {
          code: 'CP',
          name: 'Crear Persona',
          disabled: false,
          color: 'primary',
          icon: { name: 'add' },
        },
      ],
    };
  }

  renderizaTablaPersonas() {
    // debugger
    if (this.data.persona) {
      this.dataSource = new MatTableDataSource(this.expandedElement);
      this.mostrarTabs = true;
    } else if (this.data.resultados) {
      this.dataSource = new MatTableDataSource(this.expandedElement);
      this.mostrarTabs = true;
    } else {
      this.mostrarTabs = false;
    }
  }

  EstablecerDatosTabla() {
    //debugger;
    if (this.data.persona) {
      this.data.persona.forEach((element) => {
        this.fila = {
          id: element.id,
          identificacion: element.identificacion.valor,
          codigoExpediente: element.paciente.codigoExpediente.valor,
          nombreCompleto: `${element.primerNombre} ${
            element.segundoNombre || ''
          } ${element.primerApellido} ${element.segundoApellido || ''} `,
          departamento: element.divisionPolitica.residencia.departamento.nombre,
          municipio: element.divisionPolitica.residencia.municipio.nombre,
          comunidad: element.divisionPolitica.residencia.comunidad.nombre,
          pais: element.divisionPolitica.nacimiento.pais.nombre,
          sexo: element.sexo.valor,
          edad: `${element.edad.anios} años, ${element.edad.meses} meses, ${element.edad.dias} dias`,
          direccion: element.divisionPolitica.residencia.personaDireccion,
          persona: element,
        };
        this.expandedElement.push(this.fila);
      });
    } else if (this.data.resultados) {
      this.data.resultados.forEach((element) => {
        this.fila = {
          id: element.id,
          identificacion: element.identificacion.valor,
          codigoExpediente: element.paciente.codigoExpediente.valor,
          nombreCompleto: `${element.primerNombre} ${
            element.segundoNombre || ''
          } ${element.primerApellido} ${element.segundoApellido || ''} `,
          departamento: element.divisionPolitica.residencia.departamento.nombre,
          municipio: element.divisionPolitica.residencia.municipio.nombre,
          comunidad: element.divisionPolitica.residencia.comunidad.nombre,
          pais: element.divisionPolitica.nacimiento.pais.nombre,
          sexo: element.sexo.valor,
          edad: `${element.edad.anios} años, ${element.edad.meses} meses, ${element.edad.dias} dias`,
          direccion: element.divisionPolitica.residencia.personaDireccion,
          sector: element.redServicio.residencia.sector.nombre,
          persona: element,
        };
        this.expandedElement.push(this.fila);
      });
    } else {
      this.personaService.setPersonaSeleccionada('');
      this.crearPersona = true;
      //this.mostrarMensaje = true;
    }
    if (this.data['personaBusqueda']) {
      this.personaBuscada = this.data['personaBusqueda'];
      this.personaBuscada.esNoIdentificado = this.personaBuscada.esRecienNacido
        ? false
        : true;
    }
  }

  CrearPersona() {
    //debugger;
    this.crearPersona = true;
    this.mostrarMensaje = false;
  }
  ngAfterViewInit() {
    //debugger;
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  Seleccionar(e: any) {
    this.respuestaRetorno = {
      cancelar: true,
      persona: e,
      mostrar: false,
    };
    this.personaService.setPersonaSeleccionada(e);
    this.CerrarDialogo(this.respuestaRetorno);
  }

  SeleccionarContacto(e: any) {

    if (!e) {
      return;
    }
    if (e.paciente.precargado === true) {
      Swal.fire(
        'Advertencia',
        'Contacto no puede ser seleccionado, por favor confirmelo como paciente',
        'warning'
      );
      this.dataSource.data = null;
      return;
    }
    // this.personaService.setPersonaSeleccionada(e);
    this.CerrarDialogoContacto(e);
  }

  SeleccionarContactoVoid() {
    Swal.fire(
      'Advertencia',
      'Contacto no puede ser seleccionado, por favor confirmelo como paciente',
      'warning'
    );
  }

  CerrarDialogo(d: any) {
    //debugger;
    this.dialogo.close(d);
    this.ResetOpcionBusqueda();
  }
  CerrarDialogoContacto(e: any) {
    //también debe ser cerrado buscador generico
    //this.dialogRef.closeAll();
    this.dialogo.close(e);
    this.ResetOpcionBusqueda();
  }

  ResetOpcionBusqueda() {
    //debugger;
    this.busqueda = {
      esDesconocido: false,
      esRecienNacido: false,
      esNoIdentificado: false,
      cancelar: true,
    };

    this.personaService.setResultadoBusqueda(this.busqueda);
  }

  ToogleContenedorDetalle(element, expanded) {
    //debugger;
    //expandedElement = expandedElement === element  ? null : element
    if (expanded === element) {
      expanded = null;
      this.claseExpandir = 'fa fa-chevron-down';
    } else {
      expanded = element;
      this.claseExpandir = 'fa fa-chevron-up';
    }
    return expanded;
  }
}
