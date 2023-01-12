import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestApiClient } from '../rest-api/rest-api-client';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
//import { StorageService } from 'angular-webstorage-service';
import { DataRolMenu, RolMenu } from 'src/app/shared/models/rol/menu-rol';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends RestApiClient<any> {
  protected endpoint: string = environment.urlSeguridad + 'gestion-usuarios/';
  private showDashboard$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public estaAutorizado$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public rolUsuario$: BehaviorSubject<DataRolMenu[]> = new BehaviorSubject<DataRolMenu[]>([]);

  constructor(http: HttpClient) { super(http); }

  getMemberRole(id: number, role: number): Observable<any> | Observable<string> {
    return this.http.get(this.endpoint + 'miembro-roles/' + id + '/' + role)
      .pipe(map((r: any) => {
        if (r.data) {
          return r.data;
        } else { return r.error; }
      }));
  }

  obtenerDatosUsuario(idUsuario: number): Observable<any> {
    var url = this.endpoint + 'usuarios/' + idUsuario;


    return this.http.get(this.endpoint + 'usuarios/' + idUsuario).pipe(map((r: any) => {
      if (r.data) {
        return r.data;
      } else { return r.error; }
    }));
  }

  setShowDashboard(value: boolean): void {
    this.showDashboard$.next(value);
  }

  getShowDashboard(): Observable<boolean> {
    return this.showDashboard$.asObservable();
  }

  establecerAutorizacion(value: boolean): void {
    return this.estaAutorizado$.next(value);
  }

  SetRolUsuario(valor: DataRolMenu[]): void {
    return this.rolUsuario$.next(valor);
  }

  ObtenerRolUsuario(): DataRolMenu {
    let rolmenu: DataRolMenu = {};
    this.rolUsuario$.subscribe((d) => {
      // debugger;
      if (d) {
        rolmenu = d.find((p) => { return p.pasivo == false });
      }
    })
    return rolmenu
  }

}
