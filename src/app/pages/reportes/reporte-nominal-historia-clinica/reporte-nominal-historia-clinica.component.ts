import { FiltroReportes } from './../../../shared/models/historia-clinica/filtro-reportes';
import { HttpErrorResponse } from '@angular/common/http';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ThisReceiver, IfStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SYSTEM } from 'src/app/services/constantes';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica/historia-clinica.service';
import { LocalStorageAdminService } from 'src/app/services/local-storage-admin.service';
import { SbcCatEntidadesComboComponent } from 'src/app/shared/components/catalogos/sbc-cat-entidades-combo/sbc-cat-entidades-combo.component';
import { HistoriaClinica } from 'src/app/shared/models/historia-clinica/historia-clinica';
import Swal from 'sweetalert2';
import { ExportExcel } from 'src/app/services/export-exel.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reporte-nominal-historia-clinica',
  templateUrl: './reporte-nominal-historia-clinica.component.html',
  styleUrls: ['./reporte-nominal-historia-clinica.component.scss'],
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
export class ReporteNominalHistoriaClinicaComponent
  extends LocalStorageAdminService
  implements OnInit {
  public bFecha: boolean;
  public bCodigoExpediente: boolean;
  public bBuscar: boolean;
  public bCodigoHC: boolean;
  public bNombres: boolean;
  public bIdentificacion: boolean;
  public bSexo: boolean;
  public bTipoHistoria: boolean;
  public bSilais: boolean;
  public formulario_filtro: FormGroup;
  public url: string;
  protected user;
  protected sistema;
  public urlUnidad: string;

  public enableBuscar: boolean = false;
  public _mostrarMensaje: boolean = false;

  public claseExpandir: string = 'fa fa-chevron-down';

  public listaHistoriaClinicaExport: any[] = [];
  public pagNominalHC = new MatTableDataSource<any>();

  @ViewChild('unidadselected', { static: false })
  unidadSeg: SbcCatEntidadesComboComponent;
  @ViewChild('entidadFiltro', { static: false })
  silaisSeg: SbcCatEntidadesComboComponent;
  @ViewChild('paginatorRHC', { read: MatPaginator })
  paginatorRHC: MatPaginator;

  columnasBuzon: string[] = [
    'colapse',
    'numero',
    'tipoHistoria',
    'codigoExpediente',
    'nombreCompleto',
    'sexo',
    'edad',
    'usuarioRegistro',
    'fechaRegistro',
    'acciones',
  ];

  nominalHCSource: any[];

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef,
    private historiaClinicaService: HistoriaClinicaService,
    private exportService: ExportExcel
  ) {
    super();
    this.FillDatosUrl();
  }

  FillDatosUrl(): void {
    this.getLocalStorageItem('userObj')
      ? (this.user = this.getLocalStorageItem('userObj'))
      : null;
    this.getLocalStorageItem(SYSTEM)
      ? (this.sistema = this.getLocalStorageItem(SYSTEM))
      : null;
    this.urlUnidad = `gestion-usuarios/perfil-accesos/unidades/entidad/${this.user.id}/${this.sistema.id}`;
  }

  crearUrl(): void {
    const tipo = 'gestion-usuarios/perfil-accesos/entidades/';
    if (this.user && this.sistema) {
      this.url = `${tipo}${this.user.id}/${this.sistema.id}`;
    }
  }

  updateUnidad(silais: any): void {
    if (!this.unidadSeg) {
      if (silais) {
        this.formulario_filtro.get('silaisId').patchValue(silais.id);
      }
      return;
    }

    this.unidadSeg.actualizarPorReferencia(
      'referencia',
      silais ? silais.id || silais : 0
    );
    if (+silais.id > 0) {
      this.formulario_filtro.get('silaisId').patchValue(silais.id);
      if (this.formulario_filtro.get('unidadSaludId') != null) {
        if (!this.formulario_filtro.get('unidadSaludId').pristine) {
          this.resetFormsSpecific(this.formulario_filtro.get('unidadSaludId'));
        }
      }
    }
    this.cdRef.detectChanges();
  }

  private resetFormsSpecific(typeForm: any): void {
    if (!typeForm) {
      return;
    }
    typeForm.reset();
    typeForm.markAsPristine();
  }

  inicializarFormulario() {
    this.formulario_filtro = this.formBuilder.group({
      fechaInicio: new FormControl(null),
      fechaFin: new FormControl(null),
      codigoExpediente: new FormControl(null, []),
      codigoHistoriaClinica: new FormControl(null, []),
      primerNombre: new FormControl(null, []),
      segundoNombre: new FormControl(null, []),
      primerApellido: new FormControl(null, []),
      segundoApellido: new FormControl(null, []),
      identificacion: new FormControl(null, []),
      sexo: new FormGroup({
        id: new FormControl(null),
        codigo: new FormControl(''),
        valor: new FormControl(''),
      }),
      tipoHistoria: new FormGroup({
        id: new FormControl(null),
        codigo: new FormControl(''),
        valor: new FormControl(''),
      }),
      silaisId: new FormControl(null, []),
      unidadSaludId: new FormControl(null, []),
      seleccion: this.formBuilder.group({
        checkFechaHistoria: new FormControl(null, []),
        checkSILAIS: new FormControl(null, []),
        checkExpediente: new FormControl(null, []),
        checkCodigo: new FormControl(null, []),
        checkNombres: new FormControl(null, []),
        checkIdentificacion: new FormControl(null, []),
        checkSexo: new FormControl(null, []),
        checkTipoHistoria: new FormControl(null, []),
      }),
    });
    this.formulario_filtro.statusChanges.subscribe((statusForm: string) => {
      if (statusForm === 'VALID') {
        this.enableBuscar = true;
      } else {
        this.enableBuscar = false;
      }
    });
  }

  checkear(valor: boolean, seleccion: string) {
    switch (seleccion) {
      case 'fecha':
        let fechaActual = new Date();
        if (valor) {
          this.formulario_filtro.get('fechaInicio').clearValidators();
          this.formulario_filtro
            .get('fechaInicio')
            .setValidators([Validators.required]);
          this.formulario_filtro.get('fechaFin').clearValidators();
          this.formulario_filtro
            .get('fechaFin')
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bFecha = true;
        } else {
          this.formulario_filtro.get('fechaInicio').clearValidators();
          this.formulario_filtro.get('fechaInicio').reset();
          this.formulario_filtro.get('fechaFin').clearValidators();
          this.formulario_filtro.get('fechaFin').reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bFecha = false;
        }
        this.formulario_filtro.get('fechaInicio').patchValue(fechaActual);
        this.formulario_filtro.get('fechaFin').patchValue(fechaActual);
        break;

      case 'expediente':
        if (valor) {
          this.formulario_filtro.get('codigoExpediente').clearValidators();
          this.formulario_filtro
            .get('codigoExpediente')
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bCodigoExpediente = true;
        } else {
          this.formulario_filtro.get('codigoExpediente').clearValidators();
          this.formulario_filtro.get('codigoExpediente').reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bCodigoExpediente = false;
        }
        break;
      case 'codigoHistoria':
        if (valor) {
          this.formulario_filtro.get('codigoHistoriaClinica').clearValidators();
          this.formulario_filtro
            .get('codigoHistoriaClinica')
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bCodigoHC = true;
        } else {
          this.formulario_filtro.get('codigoHistoriaClinica').clearValidators();
          this.formulario_filtro.get('codigoHistoriaClinica').reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bCodigoHC = false;
        }
        break;
      case 'nombres':
        if (valor) {
          this.formulario_filtro.get('primerNombre').clearValidators();
          this.formulario_filtro
            .get('primerNombre')
            .setValidators([Validators.required]);
          this.formulario_filtro.get('primerApellido').clearValidators();
          this.formulario_filtro
            .get('primerApellido')
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bNombres = true;
        } else {
          this.formulario_filtro.get('primerNombre').clearValidators();
          this.formulario_filtro.get('primerNombre').reset();
          this.formulario_filtro.get('primerApellido').clearValidators();
          this.formulario_filtro.get('primerApellido').reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bNombres = false;
        }
        break;
      case 'identificacion':
        if (valor) {
          this.formulario_filtro.get('identificacion').clearValidators();
          this.formulario_filtro
            .get('identificacion')
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bIdentificacion = true;
        } else {
          this.formulario_filtro.get('identificacion').clearValidators();
          this.formulario_filtro.get('identificacion').reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bIdentificacion = false;
        }
        break;
      case 'sexo':
        if (valor) {
          this.formulario_filtro.get(['sexo', 'id']).clearValidators();
          this.formulario_filtro
            .get(['sexo', 'id'])
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bSexo = true;
        } else {
          this.formulario_filtro.get(['sexo', 'id']).clearValidators();
          this.formulario_filtro.get(['sexo', 'id']).reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bSexo = false;
        }
        break;
      case 'tipoHistoria':
        if (valor) {
          this.formulario_filtro.get(['tipoHistoria', 'id']).clearValidators();
          this.formulario_filtro
            .get(['tipoHistoria', 'id'])
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bTipoHistoria = true;
        } else {
          this.formulario_filtro.get(['tipoHistoria', 'id']).clearValidators();
          this.formulario_filtro.get(['tipoHistoria', 'id']).reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bTipoHistoria = false;
        }
        break;
      case 'silais':
        if (valor) {
          this.formulario_filtro.get('silaisId').clearValidators();
          this.formulario_filtro
            .get('silaisId')
            .setValidators([Validators.required]);
          this.formulario_filtro.updateValueAndValidity();
          this.bSilais = true;
        } else {
          this.formulario_filtro.get('silaisId').clearValidators();
          this.formulario_filtro.get('silaisId').reset();
          this.formulario_filtro.updateValueAndValidity();
          this.bSilais = false;
        }
        break;
    }
    this.mostrarBoton();
  }

  mostrarBoton() {
    if (
      !this.bFecha &&
      !this.bCodigoExpediente &&
      !this.bCodigoHC &&
      !this.bNombres &&
      !this.bIdentificacion &&
      !this.bSexo &&
      !this.bTipoHistoria &&
      !this.bSilais
    ) {
      this.bBuscar = false;
    } else {
      this.bBuscar = true;
    }
  }

  limpiar() {
    this.formulario_filtro.reset();
  }

  buscar() {
    if (this.formulario_filtro.valid) {
      this.obtenerRegistros();
    } else {
      Swal.fire('Advertencia', 'Complete los valores solicitados', 'warning');
      return;
    }
  }

  async obtenerRegistros() {
    this.spinner.show();

    const jsonBusqueda = {
      codigoExpediente:
        this.formulario_filtro.get('codigoExpediente').value == null
          ? null
          : this.formulario_filtro.get('codigoExpediente').value,
      historiaClinicaId:
        this.formulario_filtro.get('codigoHistoriaClinica').value == null
          ? 0
          : this.formulario_filtro.get('codigoHistoriaClinica').value,
      tipoHistoria:
        this.formulario_filtro.get(['tipoHistoria', 'id']).value == null
          ? null
          : this.formulario_filtro.get(['tipoHistoria', 'id']).value,
      fechaInicio:
        this.formulario_filtro.get('fechaInicio').value == null
          ? null
          : this.formulario_filtro.get('fechaInicio').value,
      fechaFin:
        this.formulario_filtro.get('fechaFin').value == null
          ? null
          : this.formulario_filtro.get('fechaFin').value,
      silais:
        this.formulario_filtro.get('silaisId').value == null
          ? 0
          : this.formulario_filtro.get('silaisId').value,
      unidadSaludId:
        this.formulario_filtro.get('unidadSaludId').value == null
          ? 0
          : this.formulario_filtro.get('unidadSaludId').value,
      identificacion:
        this.formulario_filtro.get('identificacion').value == null
          ? null
          : this.formulario_filtro.get('identificacion').value,
      primerNombre:
        this.formulario_filtro.get('primerNombre').value == null
          ? null
          : this.formulario_filtro.get('primerNombre').value,
      segundoNombre:
        this.formulario_filtro.get('segundoNombre').value == null
          ? null
          : this.formulario_filtro.get('segundoNombre').value,
      primerApellido:
        this.formulario_filtro.get('primerApellido').value == null
          ? null
          : this.formulario_filtro.get('primerApellido').value,
      segundoApellido:
        this.formulario_filtro.get('segundoApellido').value == null
          ? null
          : this.formulario_filtro.get('segundoApellido').value,
      sexoId:
        this.formulario_filtro.get(['sexo', 'id']).value == null
          ? 0
          : this.formulario_filtro.get(['sexo', 'id']).value,
    };

    const respuesta = await this.historiaClinicaService
      .obtenerRegistrosHistoriaClinica(jsonBusqueda)
      .toPromise();
    if (respuesta != null) {
      this.spinner.hide();
      if (respuesta.apierror.data.length > 0) {
        this.nominalHCSource = respuesta.apierror.data;
        this.pagNominalHC = new MatTableDataSource(respuesta.apierror.data);
        this.pagNominalHC.paginator = this.paginatorRHC;
      }
    } else {
      this.spinner.hide();
      if (respuesta != null) {
        this._mostrarMensaje = true;
      }
    }

  }

  ToogleContenedorDetalle(element, expanded) {
    if (expanded === element) {
      expanded = null;
      this.claseExpandir = 'fa fa-chevron-down';
    } else {
      expanded = element;
      this.claseExpandir = 'fa fa-chevron-up';
    }
    return expanded;
  }

  exportarExcel() {
    if (this.nominalHCSource === undefined) {
      return;
    }
    this.nominalHCSource.forEach((h) => {
      let historiaClinica: any = new Array<any>();

      historiaClinica['HISTORIA CLINICA ID'] = h.historiaClinicaId;
      historiaClinica['ADMISION SERVICIO'] = h.admisionServicio.id;
      historiaClinica['TIPO DE HISTORIACLINICA'] = h.tipoHistoria.valor;
      historiaClinica['PACIENTE'] =
        h.paciente.primerNombre +
        ' ' +
        (h.paciente.segundoNombre === 'N/D' ? '' : h.paciente.segundoNombre) +
        ' ' +
        h.paciente.primerApellido +
        ' ' +
        (h.paciente.segundoApellido === 'N/D'
          ? ''
          : h.paciente.segundoApellido);

      historiaClinica['TIPO DE IDENTIFICACIÓN'] =
        h.paciente.identificacion.tipo.valor;
      historiaClinica['N° IDENTIFICACIÓN'] =
        h.paciente.identificacion.numeroIdentificacion;

      historiaClinica['EXPEDIENTE ID'] = h.expediente.codigo;
      historiaClinica['SEXO'] = h.paciente.sexo.valor;
      historiaClinica['EDAD'] = h.paciente.edad;
      historiaClinica['FECHA DE NACIMIENTO'] = h.paciente.fechaNacimiento;
      historiaClinica['PAIS DE ORIGIN'] = h.paciente.paisOrigen.nombre;
      historiaClinica['DEPARTAMENTO ORIGEN'] =
        h.paciente.departamentoOrigen.nombre;
      historiaClinica['MUNICIPIO ORIGEN'] = h.paciente.municipiOrigen.nombre;
      historiaClinica['MUNICIPIO RESIDENCIA'] = h.paciente.municipiResidencia;
      historiaClinica['DIRECCIÓN DE RESIDENCIA'] =
        h.paciente.direccionResidencia;
      historiaClinica['SILAIS'] = h.entidad.nombre;
      historiaClinica['UNIDAD DE SALUD'] = h.entidad.unidadSalud.nombre;
      historiaClinica['PERSONAL DE SALUD ID'] = h.personalSalud.id;
      historiaClinica['PERSONAL DE SALUD'] =
        h.personalSalud.persona.primerNombre +
        ' ' +
        (h.personalSalud.persona.segundoNombre === 'N/D'
          ? ''
          : h.personalSalud.persona.segundoNombre) +
        ' ' +
        h.personalSalud.persona.primerApellido +
        ' ' +
        (h.personalSalud.persona.segundoApellido === 'N/D'
          ? ''
          : h.personalSalud.persona.segundoApellido);

      /*if (captacion.persona.primerNombre != null) {
          this.primerNombre = captacion.persona.primerNombre;
        } else {
          this.primerNombre = '';
        }
        */
      this.listaHistoriaClinicaExport.push(historiaClinica);
    });
    this.exportService.exportExcel(
      this.listaHistoriaClinicaExport,
      'HistoriaClinica'
    );
  }

  imprimirHC(valor: any) {
    let filtro: FiltroReportes = new FiltroReportes();
    filtro.id = valor.historiaClinicaId;
    filtro.usuarioGenera = JSON.parse(localStorage.getItem('userObj')).username;
    this.historiaClinicaService.imprimirHistoriaClinica(filtro).subscribe({
      next: (respo) => {
        let pdf = new Blob([respo], { type: 'application/pdf' });
        let url = URL.createObjectURL(pdf);
        window.open(url);
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          text: err.message,
        });
      },
    });
  }

  ngOnInit(): void {
    this.crearUrl();
    this.inicializarFormulario();
  }


  ngAfterViewInit() {
    // this.laboral_source.paginator = this.paginator;
    this.pagNominalHC.paginator = this.paginatorRHC;
  }
}
