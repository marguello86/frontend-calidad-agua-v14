import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Cie10Service,
  LoginService,
  SistemaService,
  UsuarioService,
  ModuloService,
  HeaderService,
  UnidadSaludService,
  CatalogosEmergenciaService,
  PacienteService,
} from 'src/app/services/service.index';
import { environment } from 'src/environments/environment';
import {
  CHAPTER_STRATEGY_CIE10,
  CODE_STRATEGY_CIE10,
  CODE_SYSTEM,
  EXP_TKN,
  JWT,
  STRATEGY,
  SYSTEM,
  USER,
  ROLE_ALLOW_DASHBOARD,
  MODULE_ENFERMEDADES_RESPIRATORIAS,
  ESPECIALIDADCODIGO,
  UNIDAD_USUARIO,
} from '../services/constantes';
import { ErrorDetail } from '../shared/models/util/error-detail';
import Swal from 'sweetalert2';

import { MatDialog } from '@angular/material/dialog';
import { DialogoAsignarUnidadComponent } from '../shared/components/dialogo-asignar-unidad/dialogo-asignar-unidad.component';
import { RespuestaApi } from '../shared/models/util/respuesta-api';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, AfterViewInit {
  openMenu: boolean = true;
  private isLocal: boolean = false;
  public isLoad: boolean = false;
  public deniedAccess: ErrorDetail;
  public existeUnidad: boolean = false;
  public silaisActual: string;
  public unidadActual: any;
  datosCargados: Boolean = false;
  unidadServicioStorage: any;
  unidadServicioSilais: any;
  unidadServicioUnidad: any;
  unidadServicioUnidadDepartamento: any;
  unidadServicioUnidadMunicipio: any;
  unidadUsuarioLS: any;
  municipioUnidad: any;
  unidadSaludUsuario: any;
  datosServicios: any;
  private appVersion: { version: string };
  private edadMinimaPaciente: number = 0;
  private edadMaximaPaciente: number = 0;

  constructor(
    private seguridadService: LoginService,
    private sistemaService: SistemaService,
    private moduloService: ModuloService,
    private cie10Service: Cie10Service,
    private usuarioService: UsuarioService,
    private headerService: HeaderService,
    private catalogosEmergenciaService: CatalogosEmergenciaService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dialogo: MatDialog,
    private silaisServices: UnidadSaludService,
    private httpClient: HttpClient,
    private pacienteService: PacienteService,
    private unidadSaludService: UnidadSaludService
  ) {
    //debugger;
    //this.spinner.show();
    this.isLocal = environment.local;
    if (
      this.seguridadService.getLocalStorageItem(JWT) &&
      this.seguridadService.getLocalStorageItem(USER)
    ) {
      this.getExpirationToken();
      this.validateData();
    } else {
      Swal.fire(
        'Error',
        'Usted no cuenta con los roles para esta aplicacion, por favor contactarse con el Administrador.',
        'error'
      ).then((d) => {
        if (d) {
          this.router.navigate(['logout']);
        }
      });
    }
  }

  ngOnInit() {
    //debugger
    this.obtieneEdadMinima();
    this.obtieneEdadMaxima();
    //console.log('this.unidadUsuarioLS? ', this.unidadUsuarioLS);
    if (!this.unidadUsuarioLS) {
      this.unidadUsuarioLS = JSON.parse(localStorage.getItem(UNIDAD_USUARIO));
      if (this.unidadUsuarioLS) {
        this.ObtieneServiciosPorUnidad();
      }
    } else {
      this.ObtieneServiciosPorUnidad();
    }
    this.comprobarVersion();
    this.datosRedServicio();
    //this.spinner.hide();
  }

  comprobarVersion(): void {
    this.moduloService.obtenerPorCodigo('CODVERSION').subscribe({
      next: (m) => {
        if (m.data) {
          if (m.data.length > 0) {
            if (environment.version == m.data[0].nombre) {
              location.reload();
              window.location.replace(window.location.href);
            }
          }
        }
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 403) {
          this.reloadData();
          return;
        }
      },
      complete: () => {},
    });
  }

  ngAfterViewInit() {}

  obtenerUnidadUsuaio() {
    //debugger
    this.unidadSaludService.unidadSeleccionada$.subscribe((d) => {
      if (localStorage.getItem(UNIDAD_USUARIO)) {
        this.unidadUsuarioLS = JSON.parse(localStorage.getItem(UNIDAD_USUARIO));
        // console.log('this.unidadUsuarioLS: ', JSON.stringify(this.unidadUsuarioLS, null, 2));
      }
    });
  }

  datosRedServicio() {
    this.unidadSaludService.unidadSeleccionada$.subscribe((d) => {
      if (d) {
        //debugger;
        this.unidadUsuarioLS = JSON.parse(localStorage.getItem(UNIDAD_USUARIO));
      }
    });
  }

  getExpirationToken(): void {
    // debugger;
    if (!this.seguridadService.getLocalStorageItem(EXP_TKN)) {
      //console.log('ingreso a getExpirationToken');
      this.seguridadService
        .getTokenExpiration(this.seguridadService.getLocalStorageItem(JWT))
        .subscribe({
          next: (v) => {
            if (v.token) {
              delete v.token;
            }
            this.seguridadService.setLocalStorage(EXP_TKN, v);
          },
          error: (e: HttpErrorResponse) => console.log('error ', e.message),
          complete: () => {
            if (!this.sistemaService.getLocalStorageItem(SYSTEM)) {
              this.setDataSystem();
            } else {
              if (!this.sistemaService.getLocalStorageItem(SYSTEM).id) {
                this.setDataSystem();
              }
            }
            this.validateData();
          },
        });
    }
  }

  setDataSystem(): void {
    let system: any;
    this.sistemaService.obtenerPorCodigo(CODE_SYSTEM).subscribe({
      next: (s) => {
        if (s.data) {
          system = s.data[0];
          this.headerService.infoSis.nombre = system.nombre;
          this.headerService.infoSis.codio = system.codigo;
        }
      },
      error: (e) => console.error(e),
      complete: () => {
        if (system) {
          this.getDataModule();
          if (!this.cie10Service.getLocalStorageItem(STRATEGY)) {
            this.setDataStrategyCie();
          }
          this.sistemaService.setLocalStorage(SYSTEM, system);
          this.seguridadService
            .getMemberSystems(
              this.seguridadService.getLocalStorageItem(USER).id,
              this.seguridadService.getLocalStorageItem(SYSTEM).codigo
            )
            .subscribe((r) => {
              if (!r.id) {
                this.router.navigate(['logout']);
                Swal.fire(
                  'No Autorizado',
                  'Usted no tiene permiso para ingresar a este sistema, por favor comunicarse con el administrador',
                  'error'
                );
              } else {
                this.validateMemberRole(r.id);
              }
            });
        }
      },
    });
  }

  private setDataStrategyCie(): void {
    this.cie10Service
      .obtenerCriteriosCadena(CODE_STRATEGY_CIE10, CHAPTER_STRATEGY_CIE10)
      .subscribe({
        next: (v: any) => {
          if (v.data) {
            this.cie10Service.setLocalStorage(STRATEGY, v.data[0]);
          }
        },
        error: (e: HttpErrorResponse) => console.error(e.message),
        complete: () => {
          /*this.isLoad = true; this.spinner.hide();*/
        },
      });
  }

  private validateData() {
    if (this.seguridadService.getLocalStorageItem(EXP_TKN)) {
      if (this.sistemaService.getLocalStorageItem(SYSTEM)) {
        if (!this.sistemaService.getLocalStorageItem(SYSTEM).id) {
          return;
        }
        if (!this.seguridadService.tokenIsValid()) {
          this.reloadData();
          this.seguridadService.applyConfirmDialog();
          return;
        }
        this.seguridadService
          .getMemberSystems(
            this.seguridadService.getLocalStorageItem(USER).id,
            this.seguridadService.getLocalStorageItem(SYSTEM).codigo
          )
          .subscribe({
            next: (r) => {
              //debugger;
              if (!r.id) {
                this.router.navigate(['logout']);
              } else {
                this.validateMemberRole(r.id);
              }
            },
            error: (e: HttpErrorResponse) => {
              if (e.status === 403) {
                this.reloadData();
                this.seguridadService.applyConfirmDialog();
                return;
              }
            },
            complete: () => {},
          });
      }
    }
  }

  private validateMemberRole(memberId: number) {
    //debugger;
    this.usuarioService.getMemberRole(memberId, 0).subscribe({
      next: (v) => {
        if (v) {
          if (v.length > 0 && v instanceof Array) {
            this.usuarioService.SetRolUsuario(v);
            v.forEach((rv) => {
              //debugger;
              if (!rv.pasivo) {
                this.isLoad = true;
                if (rv.rol.nombre.toLowerCase() === ROLE_ALLOW_DASHBOARD) {
                  this.usuarioService.setShowDashboard(true);
                  this.usuarioService.establecerAutorizacion(true);
                  this.mostrarDialogo();
                } else {
                  this.usuarioService.setShowDashboard(false);
                  this.usuarioService.establecerAutorizacion(false);
                  this.mostrarDialogo();
                }
                this.router.navigate(['dashboard']);
                return;
              }
            });
          } else {
            this.isLoad = true;
            this.deniedAccess = {
              title: 'Privilegios insuficientes',
              message:
                'Al parecer no tienes configurados roles para acceder al sistema, contacte al administrador del sistema',
              buttons: [
                {
                  name: 'Reintentar',
                  code: 'RT',
                  color: 'accent',
                  disabled: false,
                  icon: {
                    name: 'refresh',
                  },
                },
              ],
            };
          }
        }
      },
      error: (e: HttpErrorResponse) => {
        Swal.fire('Inconvenientes de comunicación', e.message, 'error');
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  getDataModule(): void {
    this.moduloService
      .obtenerPorCodigo(MODULE_ENFERMEDADES_RESPIRATORIAS)
      .subscribe({
        next: (m) => {
          if (m.data) {
            if (m.data.length > 0) {
              this.moduloService.setModuleSelected(m.data[0]);
              this.headerService.infoSis.nombreSecundario = m.data[0].nombre;
            }
          }
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === 403) {
            this.reloadData();
            this.seguridadService.applyConfirmDialog();
            return;
          }
        },
        complete: () => {},
      });
  }

  reloadData(): void {
    this.seguridadService.getReloadDataPostConfirm().subscribe((rd) => {
      if (rd) {
        setTimeout(() => {
          this.validateData();
        });
      }
    });
  }

  captureAction(codeAction: string): void {
    if (!codeAction) {
      return;
    }
    this.spinner.show();
    switch (codeAction) {
      case 'RT':
        this.validateData();
        break;

      default:
        break;
    }
  }

  /**
   * VALIDACIÓN PARA AGREGAR LA PANTALLA DE CONFIGURACIÓN DE UNIDAD DE SALUD
   */
  TieneUnidadDeSalud(): boolean {
    if (localStorage['UnidadSalud']) {
      this.existeUnidad = true;
    }
    return this.existeUnidad;
  }

  async ObtieneServiciosPorUnidad() {
    //debugger
    let unidad = null;
    let respuesta: RespuestaApi = null;
    if (localStorage[UNIDAD_USUARIO]) {
      try {
        unidad = JSON.parse(localStorage.getItem(UNIDAD_USUARIO)).unidad;
        respuesta = await this.catalogosEmergenciaService
          .obtieneServiciosPorUnidadSalud(unidad.id, ESPECIALIDADCODIGO)
          .toPromise();
        if (!respuesta['error'] || respuesta['error'] == '') {
          this.datosServicios = respuesta.data;
          if (this.datosServicios.length <= 0) {
            Swal.fire(
              'Advertencia',
              'Esta unidad no posee servicio de emergencia asignado, favor contacte a soporte',
              'warning'
            );
            //this.cierreSesion();
          }
        } else {
          Swal.fire('Petición fallida', respuesta.error, 'error');
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  }

  cierreSesion() {
    this.router.navigate(['logout']);
  }

  mostrarDialogo(): void {
    //debugger
    let storageUnidad: any = null;
    let sistema: any = null;

    if (localStorage[UNIDAD_USUARIO] && localStorage[SYSTEM]) {
      storageUnidad = JSON.parse(localStorage.getItem(UNIDAD_USUARIO));
      sistema = JSON.parse(localStorage.getItem(SYSTEM));
    }
    if (!storageUnidad) {
      this.dialogo
        .open(DialogoAsignarUnidadComponent, {
          disableClose: true,
          backdropClass: 'oscurecer',
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          //debugger
          this.obtenerUnidadUsuaio();
          this.ObtieneServiciosPorUnidad();
        });
    } else {
      this.silaisServices.EstablecerUnidadSalud(storageUnidad.unidad);
    }
  }

  obtieneEdadMaxima(): any {
    var datos: any;
    this.catalogosEmergenciaService
      .obtenerPorValor('EDAD_MAXIMA_EMBARAZO')
      .subscribe({
        next: (response: any) => {
          datos = response.data[0].childrens[0].valor;
        },
        error: (err: any) => {},
        complete: () => {
          if (datos) {
            //debugger;
            this.edadMaximaPaciente = parseInt(datos);
            this.SetearParametrosEdades();
            return datos;
          }
        },
      });
  }

  obtieneEdadMinima(): any {
    var datos: any;
    this.catalogosEmergenciaService
      .obtenerPorValor('EDAD_MINIMA_EMBARAZO')
      .subscribe({
        next: (response: any) => {
          datos = parseInt(response.data[0].childrens[0].valor);
        },
        error: (err: any) => {},
        complete: () => {
          if (datos) {
            this.edadMinimaPaciente = parseInt(datos);
            this.SetearParametrosEdades();
            return datos;
          }
        },
      });
  }

  SetearParametrosEdades() {
    this.pacienteService.parametrosEdades.next({
      edadmaxima: this.edadMaximaPaciente,
      edadminima: this.edadMinimaPaciente,
    });
    //console.log('paciente', this.pacienteService.parametrosEdades.value);
  }
}
