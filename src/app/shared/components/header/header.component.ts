import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { HeaderService } from 'src/app/services/header.service';
//import { LoginService } from 'src/app/services/seguridad/login.service';
import { environment } from 'src/environments/environment';
import { UsuarioGeneral } from '../../models/seguridad/usuario-general';
import { USER, UNIDAD_USUARIO, SYSTEM, ESPECIALIDADCODIGO } from 'src/app/services/constantes';
//import { UnidadSaludService } from 'src/app/services/service.index';
import { LoginService, HeaderService, UnidadSaludService, CatalogosEmergenciaService } from 'src/app/services/service.index';
import { silaisUnidadesUsuario } from '../../models/silais/silais';
import { DialogoAsignarUnidadComponent } from '../dialogo-asignar-unidad/dialogo-asignar-unidad.component';
import { MatDialog } from '@angular/material/dialog';
import { RespuestaApi } from '../../models/util/respuesta-api';
import Swal from 'sweetalert2';

export interface notificacion {
  titulo: string;
  fecha: Date;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  [x: string]: any;
  public usuario: UsuarioGeneral;

  //Variables de parámetros de sistema en header
  nombreAplicacion = '';
  nombreSecundario = '';
  codigoAplicacion = '';
  modulo = '';
  datosServicios: any;
  unidadUsuarioLS: any
  primerNombreUsuario = 'Juliana';
  primerApellidoUsuario = 'Chavarría';
  mombreUsuario = this.primerNombreUsuario + this.primerApellidoUsuario;
  usuarioLogeado = this.primerNombreUsuario + ' ' + this.primerApellidoUsuario;
  onLine = false;
  mivariable: string = '';
  private isLocal: boolean = false;
  public unidadSalud:string;
  private unidad:silaisUnidadesUsuario;
  
  /* para mostrar datos de notificaciones */

  listaNotificaciones: notificacion[] = [
    {
      titulo: 'tiene una nueva notificación',
      fecha: new Date('1/1/16'),
    },
    {
      titulo: 'tiene otra notificación',
      fecha: new Date('1/17/16'),
    },
    {
      titulo: 'Actualización de sistema programada para',
      fecha: new Date('1/28/2020'),
    },
  ];
  notas: notificacion[] = [
    {
      titulo: 'Vacation Itinerary',
      fecha: new Date('2/20/16'),
    },
    {
      titulo: 'Kitchen Remodel',
      fecha: new Date('1/18/16'),
    },
  ];


  constructor(private headerService: HeaderService, 
    private router: Router, 
    private seguridadService: LoginService,
    public unidadService: UnidadSaludService,
    private dialogo: MatDialog,
    private silaisServices: UnidadSaludService,
    private catalogosEmergenciaService: CatalogosEmergenciaService,
    private unidadSaludService: UnidadSaludService) { }

  ngOnInit() {
    this.isLocal = environment.local;
    this.usuario = this.seguridadService.getLocalStorageItem(USER);
    //primero obtenemos los datos del sistema
    this.obtieneDatosSistema();
    //primero obtenemos los datos del sistema

    this.estaEnLinea();
    //this.notificaciones();
    this.unidad=this.unidadService.unidadSeleccionada$.value;
  }

  recuperaPass() { }

  /* para mostrar datos de notificaciones */

  estaEnLinea() {
    if (this.mombreUsuario === '') {
      //se sustituirá por el nombre de usuario de LocalStorage
      this.onLine = false;
    } else {
      this.onLine = true;
    }
    // console.log('Estado actual de usuario: ', this.onLine);
  }

  iniciarSesion() {
    // console.log('ejecuto la lógica de inicio de sesión');
  }

  cerrarSesion(): void {
    this.router.navigate(['logout']);
  }

  obtieneDatosSistema() {
    var datosSis: any = this.headerService.datosSistema();
    this.nombreAplicacion = datosSis.nombre;
    this.codigoAplicacion = datosSis.codigo;
    this.nombreSecundario = datosSis.nombreSecundario;
    this.modulo = datosSis.modulos.nombreModulo;
  }

  mostrarDialogo(): void {
        this.dialogo
        .open(DialogoAsignarUnidadComponent, { disableClose: true, backdropClass: 'oscurecer' })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          this.obtenerUnidadUsuaio();
          this.ObtieneServiciosPorUnidad();
        });
  }

  obtenerUnidadUsuaio() {
    this.unidadSaludService.unidadSeleccionada$.subscribe(d => {
      if (localStorage.getItem(UNIDAD_USUARIO)) {
        this.unidadUsuarioLS = JSON.parse(localStorage.getItem(UNIDAD_USUARIO));
      }
    });
  }

  async ObtieneServiciosPorUnidad() {
    let unidad = null;
    let respuesta: RespuestaApi = null;
    if (localStorage[UNIDAD_USUARIO]) {
      try {
        unidad = JSON.parse(localStorage.getItem(UNIDAD_USUARIO)).unidad;
        respuesta = await this.catalogosEmergenciaService.obtieneServiciosPorUnidadSalud(unidad.id, ESPECIALIDADCODIGO).toPromise();
        if (!respuesta['error'] || respuesta['error'] == '') {
          this.datosServicios = respuesta.data;
        } else {
          Swal.fire('Petición fallida', respuesta.error, 'error');
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  }
}
