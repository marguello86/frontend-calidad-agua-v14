import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VidaSocialService {

  private endpoint: string = environment.urlHistoriaClinica + 'VidaSocial';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public guardarVidaSocial(detalleVidaSocial: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/crear', detalleVidaSocial, {
      headers: this.cabeceras,
    });
  }
  public actualizarVidaSocial(detalleVidaSocial: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/actualizar', detalleVidaSocial, {
      headers: this.cabeceras,
    });
  }
}
