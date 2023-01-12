import { Persona } from 'src/app/shared/models/persona/persona.models';
import Swal from 'sweetalert2';
import {
  CatalogosEmergenciaService,
  MenuService,
  PacienteService,
  PersonaService,
  UsuarioService,
} from 'src/app/services/service.index';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewInit,
} from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
//import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource, NativeDateAdapter, ThemePalette } from "@angular/material";
import { DatePipe, formatDate } from '@angular/common';
import { SbcCatEntidadesComboComponent } from '../../catalogos/sbc-cat-entidades-combo/sbc-cat-entidades-combo.component';
//import { Admision } from "../../models/ingreso/admision";
//import { DialogoAsignaComunidadComponent } from "../dialogo-asigna-comunidad/dialogo-asigna-comunidad.component";
import {
  CODIGO_ADMISION_EMERGENCIA,
  CODIGO_CLINICO_EMERGENCIA,
  ESPECIALIDADCODIGO,
  ESTADO_ADMISION,
  SYSTEM,
  UNIDAD_USUARIO,
  USER,
} from 'src/app/services/constantes';
//import { AdmisionService } from "src/app/services/emergencia/admision/admision.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { BuscadorPersonasComponent } from '../buscador-personas/buscador-personas.component';
import {
  ConsultaPersonal,
  DataPersonalMinsa,
  PersonaMinsa,
} from '../../../models/minsa-personal/minsaPersonal.models';
//import { DialogoIngresoPacienteComponent } from "../dialogoIngresoPaciente/dialogo-ingreso-paciente/dialogo-ingreso-paciente.component";
//import { DatosClinicosComponent } from "../datosClinicos/datos-clinicos.component";
//import { TriageComponent } from "../triage/triage.component";
import { Overlay } from '@angular/cdk/overlay';
import { CT_SEXO_F, CT_SEXO_M } from '../persona.const';
import { DataRolMenu } from 'src/app/shared/models/rol/menu-rol';
import { ActivatedRoute } from '@angular/router';
//import { DataMenuRolAccion, MenuRol, Permisos } from "../../models/rol/menu-rol-accion";
import { UsuarioRoleAccionService } from 'src/app/services/utility/usuario-role-accion.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { ConsultaService } from "src/app/services/emergencia/consulta/consulta.service";

@Component({
  selector: 'app-paciente-detalle',
  templateUrl: './paciente-detalle.component.html',
  styleUrls: ['./paciente-detalle.component.scss'],
})
export class PacienteDetalleComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('TablaAdminisionesPaginator', { static: false })
  paginator: MatPaginator;
  @ViewChild('TableOneSort', { static: false }) sort: MatSort;

  dataSourceAdmisiones = new MatTableDataSource<any>([]);
  dataSourceEmpty = [];
  displayedColumns = [
    'id', //id de la emergencia
    'fechaingreso',
    'embarazo',
    'motivo',
    'estadoadmision',
    'tipoingreso',
    'actions',
  ];
  displayedColumnsMale = [
    'id', //id de la emergencia
    'fechaingreso',
    'motivo',
    'estadoadmision',
    'tipoingreso',
    'actions',
  ];
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100, 300];
  @ViewChild('entAdmision', { static: false })
  entAdmision: SbcCatEntidadesComboComponent;
  @ViewChild('unidadselected', { static: false })
  unidadSeg: SbcCatEntidadesComboComponent;
  @ViewChild('BuscadorPersonas', { static: false })
  buscadorPersonas: BuscadorPersonasComponent;
  silaisSeg: SbcCatEntidadesComboComponent;
  unidadSeguimiento: any[] = [];
  entidadAdmId: number = 1;
  @Input() valor: any;
  entidadAdmon: any[] = [];
  @Input() public objeto: any;
  @Output()
  resultadoBusqueda: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _onDestroy = new Subject<void>();
  public show: boolean = false;
  public url: string;
  public urlUnidad: string;
  protected user;
  protected sistema;
  //admision: Admision = {};
  datosContacto: any = [];
  datos: any = [];
  datosContactoarray: any = {
    id: 0,
    pacienteId: 0, //paciente
    tipoRelacionId: 0,
    personaId: 0, //contacto
    tipoPersona: 1,
    contactoNombre: null,
    departamentoId: 0,
    municipioId: 0,
    comunidadId: 0,
    direccionHabitual: null,
    telefono1: null,
    telefono2: null,
    controlRegistro: {
      sistemaProcedenciaId: 0,
      unidadSaludProcedenciaId: 0,
      usuarioRegistro: null,
    },
  };
  nombre: any;
  personSelected: Persona = null;
  infopacienteForm: FormGroup;
  emergenciaForm: FormGroup;
  private subscription$: Subscription;
  public expedienteLocal: any;
  unidadSaludUsuario: any;
  mostrarUnidades: boolean = false;
  private sistemaLS: any;
  usuarioSistema: any;
  comunidadExiste: boolean = false;
  fuenteFinanciamiento: any;
  ocupacion: any;
  TipofuenteFinanciamiento: any;
  datosServicios: any;
  tipoReferencia: any;

  @Input() momentoDato: string;
  /*manejo de datetime */
  @ViewChild('picker', { static: false }) picker: any;

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = true;
  public disableMinute: boolean = false;
  public hideTime: boolean = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public defaultTime = [new Date().getHours, 0, 0];
  habilitaImpresion: boolean = false;
  dataAdmision: any;
  muestraOpcionEmbarazo: boolean = false;
  private fechaHora = new Date();
  fechaingresoDP: string;
  fechaingreso: string;
  datosAdmisionPaciente: any;
  objResidencia: any;
  escondeme: boolean = false;
  noHayAdmision: boolean = false;
  public existeAdmisionActiva: boolean = false;
  public vista: string = '';

  public avatarProfileF: string =
    'assets/images/patientAvatarProfileF.png';
  public avatarProfileM: string =
    'assets/images/patientAvatarProfileM.png';
  public avatarProfileU: string =
    'assets/images/patientAvatarProfileU.png';
  //private rolActivoUsuario: DataRolMenu = {};
  //private accionesUsuario: DataMenuRolAccion = {};
  private usuario: any;
  private unidad: any;
  //public color: ThemePalette = 'primary';
  /*manejo de datetime */
  public personalToma: any;

  @Input('mostrarAdmision') mostrarAdmision: boolean = true;

  /* OTRAS ACCIONES DEL PANEL */
  //@Input() bmostrarNuevo: EventEmitter<Boolean> = new EventEmitter<Boolean>(true);
  //@Input() bmostrarBuzonHC: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);
  //@Input() bmostrarComponenteHC: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);
  //@Input() bmostrarComponenteConsulta: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);
  //@Input() bmostrarComponenteCita: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);
  //@Input() bmostrarComponenteVacunas: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);
  //@Input() bmostrarAcciones: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);
  bmostrarNuevo: boolean = true;
  bmostrarBuzonHC: boolean =false;
  bmostrarComponenteHC: boolean =false;
  bmostrarComponenteConsulta: boolean =false;
  bmostrarComponenteCita: boolean = false;
  bmostrarComponenteVacunas: boolean =false;
  bmostrarAcciones: boolean = false;

  public eventSubject: Subject<number> = new Subject<number>();

  constructor(
    private dialog: MatDialog,
    private datepipe: DatePipe,
    public pacienteService: PacienteService,
    public personaService: PersonaService,
    //private admisionService: AdmisionService,
    public catalogosEmergenciaService: CatalogosEmergenciaService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private overlay: Overlay,
    private usuarioService: UsuarioService,
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute,
    private AccionUsuarioService: UsuarioRoleAccionService,
    private snackBar: MatSnackBar // private consultaService: ConsultaService,
  ) {
    this.FillDatosUrl();
    //this.crearUrl();
    this.InitFormulario();
  }
  FillDatosUrl(): void {
    this.personaService.getLocalStorageItem('userObj')
      ? (this.user = this.personaService.getLocalStorageItem('userObj'))
      : null;
    this.personaService.getLocalStorageItem(SYSTEM)
      ? (this.sistema = this.personaService.getLocalStorageItem(SYSTEM))
      : null;
    //this.urlUnidad = `gestion-usuarios/perfil-accesos/unidades/entidad/${this.user.id}/${this.sistema.id}`;
  }
  InitFormulario() {
    this.emergenciaForm = this.formBuilder.group({
      id: [{ value: null, disabled: false }],
      codigo: [{ value: null, disabled: true }],
      expedientelocal: [{ value: null, disabled: false }],
      tipoingreso: this.formBuilder.group({
        id: [{ value: null, disabled: false }, [Validators.required]],
        codigo: [{ value: null, disabled: false }],
        valor: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
      expediente: this.formBuilder.group({
        id: [{ value: null, disabled: true }], //expediente único
        codigo: [{ value: null, disabled: false }],
        valor: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
      pxresidencia: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
      }),
      contactourgencia: this.formBuilder.group({
        id: [{ value: null, disabled: false }],
        pacienteId: [{ value: null, disabled: false }],
        tipoRelacionId: [{ value: null, disabled: false }],
        personaId: [{ value: null, disabled: false }],
        tipoPersona: [{ value: '1', disabled: false }],
        contactoNombre: [{ value: null, disabled: false }],
        primerApellido: [{ value: null, disabled: false }],
        primerNombre: [{ value: null, disabled: false }],
        segundoApellido: [{ value: null, disabled: false }],
        segundoNombre: [{ value: null, disabled: false }],
        personaNombre: [{ value: null, disabled: false }],
        departamentoId: [{ value: null, disabled: false }],
        municipioId: [{ value: null, disabled: false }],
        comunidadId: [{ value: null, disabled: false }],
        direccionhabitual: [{ value: null, disabled: false }],
        telefono1: [{ value: null, disabled: false }],
        telefono2: [{ value: null, disabled: false }],
        controlregistro: this.formBuilder.group({
          sistemaProcedenciaId: [{ value: null, disabled: false }],
          unidadSaludProcedenciaId: [{ value: null, disabled: false }],
          usuarioRegistro: [{ value: null, disabled: false }],
          usuarioModificacion: [{ value: null, disabled: false }],
        }),
      }),
      minsapersonal: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
      }),
      unidadsalud: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        codigo: [{ value: null, disabled: false }],
        valor: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
      divisionpoliticaocurre: this.formBuilder.group({
        divisionpolitica: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          region: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          departamento: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          municipio: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          distrito: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          comunidad: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
        }),
      }),
      direccionhabitual: [{ value: null, disabled: true }],
      divisionpoliticareside: this.formBuilder.group({
        divisionpolitica: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          region: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          departamento: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          municipio: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          distrito: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          comunidad: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
        }),
        direccionhabitual: [{ value: null, disabled: true }],
      }),
      redservicioocurre: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        sector: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        entidad: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: 'fsfsfadada', disabled: true }],
          codigo: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        unidad: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
      }),
      redservicioreside: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        sector: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        entidad: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        unidad: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
      }),
      admisionservicio: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        servicio: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          especialidad: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: false }],
            nombre: [{ value: null, disabled: false }],
            descripcion: [{ value: null, disabled: false }],
            pasivo: [{ value: false, disabled: false }],
          }),
          nombre: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        codigo: [{ value: null, disabled: false }],
        minsapersonal: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          // persona logeada.
        }),
        dependencia: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          nombre: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          correo: [{ value: null, disabled: false }],
          tipo: [{ value: null, disabled: false }],
          telefono: [{ value: null, disabled: false }],
          indpublco: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        pasivo: [{ value: false, disabled: false }],
        usuarioregistro: [{ value: null, disabled: true }],
        fecharegistro: [{ value: null, disabled: true }],
        usuariomodificacion: [{ value: null, disabled: true }],
        fechamodificacion: [{ value: null, disabled: true }],
      }),
      reingreso: [{ value: null, disabled: true }],
      fechaingresoDP: [{ value: null, disabled: false }],
      fechaingreso: [{ value: null, disabled: false }],
      estado: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        codigo: [{ value: null, disabled: false }],
        valor: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
      sistemaprocedencia: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        nombre: [{ value: null, disabled: true }],
        descripcion: [{ value: null, disabled: false }],
        codigo: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
      motivo: [{ value: null, disabled: false }, [Validators.required]],
      comentarios: [{ value: null, disabled: false }],
      turno: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
      }),
      triage: this.formBuilder.group({
        //aqui lo dejo, seguir fin de semana
        id: [{ value: null, disabled: true }],
        admisionservicio: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          servicio: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: true }],
            especialidad: this.formBuilder.group({
              id: [{ value: null, disabled: true }],
              codigo: [{ value: null, disabled: true }],
              nombre: [{ value: null, disabled: true }],
              descripcion: [{ value: null, disabled: true }],
              pasivo: [{ value: false, disabled: true }],
            }),
            nombre: [{ value: null, disabled: true }],
            descripcion: [{ value: null, disabled: true }],
            pasivo: [{ value: false, disabled: true }],
          }),
          codigo: [{ value: null, disabled: true }],
          minsapersonal: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
          }),
          dependencia: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            nombre: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: true }],
            correo: [{ value: null, disabled: true }],
            tipo: [{ value: null, disabled: true }],
            telefono: [{ value: null, disabled: true }],
            indpublico: [{ value: null, disabled: true }],
            pasivo: [{ value: false, disabled: true }],
          }),
          pasivo: [{ value: false, disabled: false }],
          usuarioregistro: [{ value: null, disabled: true }],
          fecharegistro: [{ value: null, disabled: true }],
          usuariomodificacion: [{ value: null, disabled: true }],
          fechamodificacion: [{ value: null, disabled: true }],
        }),
        minsapersonal: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          persona: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            identificacion: [{ value: null, disabled: true }],
            nombrecompleto: [{ value: null, disabled: true }],
            direcciondomicilio: [{ value: null, disabled: true }],
            telefono: [{ value: null, disabled: true }],
            sexo: [{ value: null, disabled: true }],
          }),
          tipopersonal: this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            codigo: [{ value: null, disabled: true }],
            valor: [{ value: null, disabled: true }],
            descripcion: [{ value: null, disabled: true }],
            pasivo: [{ value: false, disabled: true }],
          }),
          correo: [{ value: null, disabled: true }],
          telefono: [{ value: null, disabled: true }],
          indpublico: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        tipoatencion: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          valor: [{ value: null, disabled: true }],
          descripcion: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        estadofisico: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          valor: [{ value: null, disabled: true }],
          descripcion: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        prioridad: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          valor: [{ value: null, disabled: true }],
          descripcion: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        motivo: [{ value: null, disabled: true }],
        filtro: [{ value: null, disabled: true }],
        fechallegada: [{ value: null, disabled: true }],
        fechaprevistaatencion: [{ value: null, disabled: true }],
        fechaatencion: [{ value: null, disabled: true }],
        frecuenciaanual: [{ value: null, disabled: true }],
        frecuenciaepisodio: [{ value: null, disabled: true }],
        estadoregistro: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          valor: [{ value: null, disabled: true }],
          descripcion: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        accionestado: [{ value: null, disabled: true }],
        usuarioregistro: [{ value: null, disabled: true }],
        usuariomodificacion: [{ value: null, disabled: true }],
      }),
      usuarioregistro: [{ value: null, disabled: false }],
      usuariomodificacion: [{ value: null, disabled: true }],
      embarazo: [{ value: 0, disabled: false }],
      fecharegistro: [{ value: null, disabled: false }],
      fechamodificacion: [{ value: null, disabled: false }],
      personaPx: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        identificacion: [{ value: null, disabled: true }],
        nombrecompleto: [{ value: null, disabled: true }],
        direcciondomicilio: [{ value: null, disabled: true }],
        telefono: [{ value: null, disabled: true }],
        sexo: [{ value: null, disabled: true }],
        edad: [{ value: null, disabled: true }],
      }),
      estadoadmision: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        codigo: [{ value: null, disabled: false }],
        valor: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
      financiamiento: this.formBuilder.group({
        id: [{ value: null, disabled: false }],
        fuente: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        categoria: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        ocupacion: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        codigoafiliacion: [{ value: null, disabled: false }],
        empleador: [{ value: null, disabled: false }],
        direccionempleador: [{ value: null, disabled: false }],
      }),
      listadatosclinicos: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        tipodato: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          valor: [{ value: null, disabled: true }],
          descripcion: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        valormedicion: [{ value: null, disabled: true }],
        momentomedicion: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: true }],
          valor: [{ value: null, disabled: true }],
          descripcion: [{ value: null, disabled: true }],
          pasivo: [{ value: false, disabled: true }],
        }),
        valorrelacional: [{ value: null, disabled: true }],
      }),
      dependencia: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        nombre: [{ value: null, disabled: true }],
        codigo: [{ value: null, disabled: true }],
        correo: [{ value: null, disabled: true }],
        tipo: [{ value: null, disabled: true }],
        telefono: [{ value: null, disabled: true }],
        indpublico: [{ value: null, disabled: true }],
        pasivo: [{ value: false, disabled: true }],
      }),
      referencia: this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        inadecuada: [{ value: false, disabled: true }],
        usuariomodificacion: [{ value: null, disabled: true }],
        usuarioregistro: [{ value: null, disabled: true }],
        tiporeferencia: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        silaisorigen: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
        }),
        unidadorigen: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        unidaddestino: this.formBuilder.group({
          id: [{ value: null, disabled: false }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
        expediente: this.formBuilder.group({
          id: [{ value: null, disabled: true }],
          codigo: [{ value: null, disabled: false }],
          valor: [{ value: null, disabled: false }],
          descripcion: [{ value: null, disabled: false }],
          pasivo: [{ value: false, disabled: false }],
        }),
      }),
      tipotransporte: this.formBuilder.group({
        id: [{ value: null, disabled: false }],
        codigo: [{ value: null, disabled: false }],
        valor: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
    });
    this.emergenciaForm.valueChanges.subscribe({
      next: (val: any) => {
        //console.log('form ha cambiado: ', val);
        this.findInvalidControls();
        if (val.expedientelocal) {
          this.expedienteLocal = val.expedientelocal;
        }
        //this.transfDatefechaIngreso();
      },
    });
  }
  public findInvalidControls() {
    //console.log(' entramos a findInvalidControls')
    const invalid = [];
    const controls = this.emergenciaForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    //console.log("controles inválidos: ", invalid);
    return invalid;
  }
  getAvatarProfile(code: string): string {
    switch (code) {
      case CT_SEXO_F:
        return this.avatarProfileF;
      case CT_SEXO_M:
        return this.avatarProfileM;
      default:
        return this.avatarProfileU;
    }
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.personaService.setPersonaSeleccionada(null);
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  obtPersonaSeleccionada() {
    this.subscription$ = this.personaService.personSelected$
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (p: any) => {
          //debugger;
          this.personSelected = p;
          // console.log("this personselected: ", this.personSelected);
          if (this.personSelected) {
            this.resultadoBusqueda.emit(true);
            var codExpUnico = this.personSelected.paciente.id;
            var unidadUsuarioLS = localStorage.getItem(UNIDAD_USUARIO);
            this.unidadSaludUsuario = JSON.parse(unidadUsuarioLS);
            this.unidadSaludUsuario.unidad.id;
            if (
              this.personSelected.sexo.codigo === 'SEXO|F' ||
              this.personSelected.sexo.valor === 'MUJER'
            ) {
              this.muestraOpcionEmbarazo = true;
            }
            /*  this.obtieneServiciosPorUnidad();
            this.obtAdmisionesPacientePorUnidad(
              this.personSelected.paciente.codigoExpediente
            );
            if (this.personSelected.detalle.tipoPersona.codigo != 'DSCN') //desconocido
            {
              //debugger
              this.obtieneResidencias();
            } */
          }
        },
        error: (e: HttpErrorResponse) => {
          //this.spinner.hide();
          Swal.fire('Petición fallida', e.message, 'error');
        },
        complete: () => {
          //  console.log("entramos a complete de obtener persona seleccionada");
        },
      });
  }
  obtieneResidencias() {
    var errores: any;
    var expId = this.personSelected.paciente.codigoExpediente.id;
    this.personaService.ObtienedatosResidenciaPersona(expId).subscribe({
      next: (respuesta: any) => {
        //debugger;
        errores = respuesta.error;
        if (errores) {
          Swal.fire('error', errores.messageUser, 'error');
        } else {
          this.objResidencia = respuesta.datos[0];
          //console.log('que vale this.objResidencia: ', this.objResidencia);
          return this.objResidencia;
        }
      },
      error: (err: any) => {
        Swal.fire('error', err, 'error');
      },
      complete: () => {},
    });
  }
  obtieneServiciosPorUnidad() {
    var datos: any;
    var errores: any;
    this.catalogosEmergenciaService
      .obtieneServiciosPorUnidadSalud(
        this.unidadSaludUsuario.unidad.id,
        ESPECIALIDADCODIGO
      )
      .subscribe({
        next: (respuesta: any) => {
          errores = respuesta.error;
          if (errores) {
            // console.error("hay errores al obtener servicio emergencia");
            Swal.fire('error', errores, 'error');
          } else {
            datos = respuesta.data;
            this.datosServicios = datos;

            if (this.datosServicios.length <= 0) {
              // Swal('Advertencia', 'Esta unidad no posee servicio de emergencia asignado, favor contacte a soporte', 'warning');
              this.noHayAdmision = true;
            } else {
              this.emergenciaForm
                .get('admisionservicio.servicio')
                .patchValue(this.datosServicios[0]);
              //aqui hay que hacerle también admisionservicio.servicio
            }
          }
        },
        error: (e: HttpErrorResponse) => {
          //this.spinner.hide();
          Swal.fire('Petición fallida', e.message, 'error');
        },
        complete: () => {
          //console.log('entramos a complete de servicios por unidad');
          this.inicializaEmergenciasForm();
        },
      });
  }
  obtAdmisionesPacientePorUnidad(Objfiltro: any) {
    //debugger;
    if (Objfiltro) {
      let datos: any;
      let errores: any;
      let mensaje: any;
      let filtro: any = {
        expedienteid: Objfiltro.id,
        unidadid: this.unidad.id,
      };
      this.spinner.show();
      /*  this.admisionService.admisionesPacienteUnidad(filtro).subscribe({
        next: (response: any) => {
          //debugger;
          // this.spinner.show();
          errores = response.error;
          if (errores) {
            this.spinner.hide();
            Swal.fire('Error', response.message, 'error');
          }
          else {
            //debugger
            var datos = response.data;
            var admFiltXUnidad: any;
            this.existeAdmisionActiva = datos.filter(el => el.estadoadmision.codigo === ESTADO_ADMISION).length >= 1 ? true : false;
            // console.log("obtenemos Admisiones de Paciente PorUnidad",datos);
            //admFiltXUnidad = datos.filter(d => d.unidadsalud.id === this.unidadSaludUsuario.unidad.id);
            admFiltXUnidad = datos;
            this.obtieneObjetosParaOrdenar(admFiltXUnidad);
            this.dataSourceAdmisiones.data = this.dataSourceEmpty;
            this.dataSourceAdmisiones.data = admFiltXUnidad;
            this.dataSourceAdmisiones.paginator = this.paginator;
            if (this.dataSourceAdmisiones.data) {
              this.pacienteService.setContactoSeleccionado(this.dataSourceAdmisiones.data[0] ? this.dataSourceAdmisiones.data[0].contactourgencia : null);
            }
            // console.log("obtenemos Admisiones de Paciente PorUnidad",this.dataSourceAdmisiones);
          }
        },
        error: (e: HttpErrorResponse) => {
          this.spinner.hide();
          Swal.fire('Petición fallida', e.message, 'error');
        },
        complete: () => {
          this.spinner.hide();
        },
      }); */
    }
  }
  obtieneObjetosParaOrdenar(objAOrdenar: any) {
    objAOrdenar.sort((a, b) => this.compare(a.id, b.id, false))[0];
    //console.warn('admisiones ordenadas Descente: ', admisiones);
    return objAOrdenar.sort((a, b) => this.compare(a.id, b.id, false))[0];
  }
  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc?: boolean
  ) {
    return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
  }
  /* Inicalizadores */

  inicializaEmergenciasForm() {
    //debugger
    var sistemaLS = localStorage.getItem(SYSTEM);
    this.sistemaLS = JSON.parse(sistemaLS);
    var CodexpUnico = this.personSelected.paciente.id;
    var unidadUsuarioLS = localStorage.getItem(UNIDAD_USUARIO);
    this.unidadSaludUsuario = JSON.parse(unidadUsuarioLS);
    var usuarioSistemaLS = localStorage.getItem('userObj');
    this.usuarioSistema = JSON.parse(usuarioSistemaLS);
    /*expediente */
    this.emergenciaForm
      .get('expediente')
      .patchValue(this.personSelected.paciente.codigoExpediente);
    /*expediente */

    /*UnidadSalud */
    this.emergenciaForm
      .get('unidadsalud')
      .patchValue(this.unidadSaludUsuario.unidad);
    /*UnidadSalud */

    /*Dirección habitual */
    this.emergenciaForm
      .get('direccionhabitual')
      .patchValue(
        this.personSelected.divisionPolitica.residencia.personaDireccion
      );
    /*Dirección habitual */

    /*redservicioocurre */
    this.emergenciaForm
      .get('redservicioocurre.entidad')
      .patchValue(this.unidadSaludUsuario.silais);
    this.emergenciaForm
      .get('redservicioocurre.sector')
      .patchValue(this.unidadSaludUsuario.unidad.sector);
    this.emergenciaForm
      .get('redservicioocurre.unidad')
      .patchValue(this.unidadSaludUsuario.unidad);
    /*redservicioocurre */

    /*divisionpoliticaocurre */
    this.emergenciaForm
      .get('divisionpoliticaocurre.divisionpolitica.region')
      .patchValue(this.unidadSaludUsuario.silais.municipio.departamento.region);
    this.emergenciaForm
      .get('divisionpoliticaocurre.divisionpolitica.departamento')
      .patchValue(this.unidadSaludUsuario.silais.municipio.departamento);
    this.emergenciaForm
      .get('divisionpoliticaocurre.divisionpolitica.municipio')
      .patchValue(this.unidadSaludUsuario.unidad.municipio);
    //this.emergenciaForm.get('divisionpoliticaocurre.divisionpolitica.distrito').patchValue(null);
    this.emergenciaForm
      .get('divisionpoliticaocurre.divisionpolitica.comunidad')
      .patchValue(this.unidadSaludUsuario.unidad.comunidad);
    /*divisionpoliticaocurre */

    /*redservicioreside */
    this.emergenciaForm
      .get('redservicioreside.sector')
      .patchValue(this.personSelected.redServicio.residencia.sector);
    this.emergenciaForm
      .get('redservicioreside.entidad')
      .patchValue(
        this.personSelected.redServicio.residencia.entidadAdministrativa
      );
    this.emergenciaForm
      .get('redservicioreside.unidad')
      .patchValue(this.personSelected.redServicio.residencia.unidadSalud);
    /*redservicioreside */

    /*Red de Servicio Ocurre */
    this.emergenciaForm
      .get('divisionpoliticareside.divisionpolitica')
      .patchValue(this.personSelected.divisionPolitica.residencia);
    this.emergenciaForm
      .get('divisionpoliticareside.direccionhabitual')
      .patchValue(
        this.personSelected.divisionPolitica.residencia.personaDireccion
      );
    //debugger
    //this.comunidadExiste = this.personSelected.paciente.precargado; //si precargado = false, entonces la persona tiene comunidad establecida
    if (this.personSelected.divisionPolitica.residencia.comunidad.id > 0) {
      this.comunidadExiste = false; //si precargado = false, entonces la persona tiene comunidad establecida
    }

    /*Red de Servicio Ocurre */

    /*sistemaprocedencia */
    this.emergenciaForm.get('sistemaprocedencia').patchValue(this.sistemaLS);
    /*sistemaprocedencia */

    /*Contacto Urgencia */
    this.emergenciaForm
      .get('contactourgencia.controlregistro.sistemaProcedenciaId')
      .patchValue(this.sistemaLS.id);
    this.emergenciaForm
      .get('contactourgencia.controlregistro.unidadSaludProcedenciaId')
      .patchValue(this.unidadSaludUsuario.unidad.id);
    this.emergenciaForm
      .get('contactourgencia.controlregistro.usuarioRegistro')
      .patchValue(this.usuarioSistema.username);
    this.emergenciaForm
      .get('contactourgencia.controlregistro.usuarioModificacion')
      .patchValue(this.usuarioSistema.username);
    /*Contacto Urgencia */

    /*usuario modifica/crea */
    this.emergenciaForm
      .get('usuarioregistro')
      .patchValue(this.usuarioSistema.username);
    this.emergenciaForm
      .get('usuariomodificacion')
      .patchValue(this.usuarioSistema.username);
    /*usuario modifica/crea */

    if (this.comunidadExiste === true) {
      //ejecutamos función para mostrar dialog para establecer comunidad
      // this.asignarComunidad();
    } else {
      this.obtieneExpedientesLocales(
        CodexpUnico,
        this.unidadSaludUsuario.unidad.id
      );
    }
  }
  /* Inicalizadores */
  obtieneExpedientesLocales(CodexpUnico: number, unidadUsuarioId: number) {
    //debugger;
    var datos: any;
    var filtrado: any;
    var errores: any;
    var mensaje: any;
    this.pacienteService.obtenerExpedientesLocales(CodexpUnico).subscribe({
      next: (respuesta: any) => {
        //debugger
        errores = respuesta.error;
        if (errores) {
          //hay un error
          //console.error("hay errores desde el API");
          //verificamos el tipo de error, para tomar una decisión
          //Swal('Error', errores.mensaje, 'error');
          return;
        } else {
          var datos = respuesta.datos;
          if (datos.length === 0 || datos === undefined) {
            //paciente no tiene expediente local en ninguna unidad, se puede habilitar el llenado de expediente local';
            //console.log("paciente no tiene expediente local en ninguna unidad, se puede habilitar el llenado de expediente local");
          } else {
            //tiene expediente en alguna unidad, verificar si tiene en la unidad donde se realiza la emergencia por filtrado de datos
            if (unidadUsuarioId > 0 || unidadUsuarioId != undefined) {
              //console.log("que obtenemos de expedientes locales y luego se procederá a filtrar por la unidad en que ocurre la emergencia",datos);
              filtrado = datos.filter(
                (f) => f.unidadSaludId === unidadUsuarioId
              );
              if (filtrado.length > 0) {
                //console.log("hospital filtrado: ", filtrado);
                // console.log("Expediente local: ", filtrado[0].expedienteLocal, ' en hospital en donde se da la atención: ', filtrado[0].unidadSaludNombre);
                this.expedienteLocal = filtrado[0].expedienteLocal;
                //console.log("que vale expediente local: ", this.expedienteLocal);
                this.emergenciaForm
                  .get('expedientelocal')
                  .patchValue(this.expedienteLocal);
                this.emergenciaForm.get('expedientelocal').disable();
              }
            }
          }
        }
      },
      error: (e: HttpErrorResponse) => {
        //this.spinner.hide();
        Swal.fire('Petición fallida', e.message, 'error');
      },
      complete: () => {},
    });
  }
  CopiarCodigo(valor: any, name: string) {
    //debugger;
    navigator.clipboard.writeText(valor);
    this.MostrarSnackbar('Codigo único copiado', 'Ok');
  }
  MostrarSnackbar(mensaje: string, accion: string) {
    this.snackBar.open(mensaje, accion, {
      duration: 3000,
    });
  }

  medicoSelected(minsaPersonalSelected: any): void {
    //codigo minsa 13494 15958
    if (!minsaPersonalSelected) {
      return;
    }
    let nombreCompleto: string;
    let minsaPersona: any = minsaPersonalSelected.persona;
    nombreCompleto =
      minsaPersona.primernombre +
      ' ' +
      minsaPersona.segundonombre +
      ' ' +
      minsaPersona.primerapellido +
      ' ' +
      minsaPersona.segundoapellido;
    if (
      !Array.isArray(minsaPersonalSelected) &&
      minsaPersonalSelected != undefined
    ) {
      this.personalToma = {
        id: minsaPersonalSelected.mperssalud.id,
      };
      //this.formdatosClinicos.get('nombrePersonalMinsa').setValue(minsaPersonalSelected.codigo + ' - ' + nombreCompleto);
    } else {
      this.personalToma = null;
      //this.formdatosClinicos.get('nombrePersonalMinsa').reset();
    }
    //this.formNotaEvolucionTratamiento.get(['detalle', 'nota', 'medicoTomaNota']).patchValue(minsaPersonalSelected);
    //this.formNotaEvolucionTratamiento.get(['personalSalud']).patchValue(minsaPersonalSelected)
  }

  ngOnInit(): void {
    if (localStorage[USER] && localStorage[UNIDAD_USUARIO]) {
      this.usuario = JSON.parse(localStorage.getItem(USER));
      this.unidad = JSON.parse(localStorage.getItem(UNIDAD_USUARIO)).unidad;
    }
    this.obtPersonaSeleccionada();
    //this.asignarFecha();
    if (this.activatedRoute.data) {
      this.activatedRoute.data.subscribe((d) => {
        this.vista = d['titulo'];
        //console.log(this.vista);
      });
    }
    console.log(this.personSelected);
    
  }


  /*-------------------------------------------ACCIONES HISTORIA CLÍNICA-------------------------------------------*/
  accionesHistoriaClinica(parametro: number){
    this.eventSubject.next(parametro);
  }
  nuevaHistoriaClinica() {
    this.bmostrarNuevo = false;
    this.bmostrarBuzonHC = false;
    this.bmostrarComponenteHC=true;
    this.bmostrarComponenteConsulta=false;
    this.bmostrarComponenteCita=false;
    this.bmostrarComponenteVacunas=false;
    this.bmostrarAcciones=false;
  }
}
