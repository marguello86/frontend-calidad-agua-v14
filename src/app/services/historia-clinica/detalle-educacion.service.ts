import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleEducacionService {
  private endpoint: string = environment.urlHistoriaClinica + 'Educacion';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public guardarDetalleEducacion(detalleEducacion: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/crear', detalleEducacion, {
      headers: this.cabeceras,
    });
  }
  public actualizarDetalleEducacion(detalleEducacion: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/actualizar', detalleEducacion, {
      headers: this.cabeceras,
    });
  }
}
