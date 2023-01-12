import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudResumenClinicoService {
  private endpoint: string =
  environment.urlHistoriaClinica + 'ResumenClinico/Solicitud/';
private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public crearSolicitudesResumeClinico(solicitud: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'crear', solicitud, {
      headers: this.cabeceras,
    });
  }

  public editarSolicitudesResumeClinico(solicitud: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizar', solicitud, {
      headers: this.cabeceras,
    });
  }

  public eliminarSolicitudesResumeClinico(solicitud: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizarEstado', solicitud, {
      headers: this.cabeceras,
    });
  }

}
