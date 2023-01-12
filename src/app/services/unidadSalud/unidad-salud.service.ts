import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { LocalStorageAdminService } from '../local-storage-admin.service';
import { silaisUnidadesUsuario } from 'src/app/shared/models/silais/silais';
import { LoginService } from '../seguridad/login.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadSaludService extends LocalStorageAdminService {
  private url: string = environment.urlSeguridad;
  private urlServicioUnidad: string = environment.urlWsHospitalario;
  private urlEmergencia: string = environment.urlEmergencia;
  public seleccionUnidad$: Subscription;
  public unidadSeleccionada$: BehaviorSubject<silaisUnidadesUsuario> = new BehaviorSubject<any>('');

  constructor(
    private http: HttpClient,
    private seguridad: LoginService
  ) {
    super();
  }
  //* OBSERVABLE PARA DEFINIR LA UNIDAD DE SALUD
  public EstablecerUnidadSalud(unidad: silaisUnidadesUsuario): void {
    this.unidadSeleccionada$.next(unidad);
  }
  /** 
   * METODO QUE CONSUME LA API
  */
  cargarUnidades(idUsuario: number, idSistema: number, silais: number): Observable<any> {
    return this.http.get(`${this.url}gestion-usuarios/perfil-accesos/unidades/entidad/${idUsuario}/${idSistema}/${silais}`)
      .pipe(
        retry(2),
        catchError(e => {
          return throwError(e);
        }));
  }
  cargarSilais(idUsuario: number, idSistema: number) {
    return this.http.get(`${this.url}gestion-usuarios/perfil-accesos/entidades/${idUsuario}/${idSistema}`)
      .pipe(
        retry(2),
        catchError(e => {
          return throwError(e);
        })
      );
  }

  ObtenerServiciosPorUnidad(idUnidad) {
    return this.http.get(`${this.urlServicioUnidad}unisaludservicios/${idUnidad}`)
      .pipe(
        retry(2),
        catchError(e => { return throwError(e); })
      );
  }

}