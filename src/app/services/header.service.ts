import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SYSTEM } from './constantes';
import { LocalStorageAdminService } from './local-storage-admin.service';

@Injectable({
  providedIn: 'root'
})

export class HeaderService extends LocalStorageAdminService {
  /*definicion de datos temporales */

  //Datos de sistema
  infoSis: any = {
    id: 1,
    nombre: this.getLocalStorageItem(SYSTEM) ? this.getLocalStorageItem(SYSTEM).nombre : 'Sistema de vigilancia',
    codigo: this.getLocalStorageItem(SYSTEM) ? this.getLocalStorageItem(SYSTEM).codigo : 'Sistema de vigilancia',
    nombreSecundario: '',
    version: 1.0,
    modulos: {
      idModulo: 1,
      nombreModulo: 'Captación de personas',
      version: 3.14159,
    },
  };
  //Datos de sistema

  //Menú de sistema

  //Menú de sistema

  /*definicion de datos temporales */

  constructor(private http: HttpClient) {
    super();
    //this.moduloService.getModuleSelected().subscribe(m => { if (m) { this.infoSis.nombreSecundario = m.nombre; } });
  }

  //obtenemos datos generales del sistema
  datosSistema() {
    var datosSistema: any = this.infoSis;
    return datosSistema;
  }
}
