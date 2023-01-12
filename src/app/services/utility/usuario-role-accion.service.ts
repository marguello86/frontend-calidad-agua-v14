import { Injectable } from '@angular/core';
import { DataRolMenu } from 'src/app/shared/models/rol/menu-rol';
import { DataMenuRolAccion, MenuRol } from 'src/app/shared/models/rol/menu-rol-accion';
import {
  CODIGO_ADMISION_EMERGENCIA
} from '../constantes';
import { MenuService } from '../menu/menu.service';
import { UsuarioService } from '../seguridad/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioRoleAccionService {
  private rolActivoUsuario: DataRolMenu = {};
  private accionesUsuario: DataMenuRolAccion = {};

  constructor(
    private menuService: MenuService,
    private usuarioService: UsuarioService
  ) {
    this.ObtenerRolActivoUsuario();
    this.ObtenerRolAccionSistema();
  }

  ObtenerRolAccionSistema() {
    //debugger;
    this.accionesUsuario = this.menuService.ObtenerMenuRolAccion();
    console.log(this.accionesUsuario);
  }

  ObtenerRolActivoUsuario() {
    //debugger;
    let rol: DataRolMenu = {};
    rol = this.usuarioService.ObtenerRolUsuario();
    if (rol) {
      this.rolActivoUsuario = rol;
      //console.log('objrol', this.rolActivoUsuario);
    }
  }

  HabilitarPorRoles(accion: string, codVista: string) {
    //debugger;
    let habilitar: boolean = false;
    let permisos: MenuRol[] = [];
    if (codVista) {
      permisos = this.accionesUsuario.sistema.menu.filter((d) => {
        return d.codigo === codVista;
      });
      if (permisos[0].permisos.length > 0) {
        //console.log('permisos', permisos);
        habilitar = permisos[0].permisos.find((d) => {
          return d.codigo === accion;
        })
          ? true
          : false;
      }
    }
    habilitar = true;
    return habilitar;
  }
}
