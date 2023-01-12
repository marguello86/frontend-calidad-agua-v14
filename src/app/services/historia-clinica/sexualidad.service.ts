import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SexualidadService {
  private endpoint: string = environment.urlHistoriaClinica + 'Sexualidad';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  public guardarSexualidad(sexualidad: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/crear', sexualidad, {
      headers: this.cabeceras,
    });
  }
  public actualizarSexualidad(sexualidad: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/actualizar', sexualidad, {
      headers: this.cabeceras,
    });
  }

  public eliminarAntiConceptivos(detalle: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/actualizarEstado', detalle, {
      headers: this.cabeceras,
    });
  }
}
