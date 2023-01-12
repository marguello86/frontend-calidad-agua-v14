import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AntecedenteSocioeconomicoService {

  private endpoint: string = environment.urlHistoriaClinica + 'AntecedentesSocioEconomicos';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  /**ANTECEDENTES SOCIO ECONOMICO */
  guardarAntecedentesSocioEconomicos(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "/crear", objeto, {
      headers: this.cabeceras,
    });
  }
  actualizarAntecedentesSocioEconomicos(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + "/actualizar", objeto, {
      headers: this.cabeceras,
    });
  }
  eliminarAntecedentesSocioEconomicos(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + "/actualizarEstado", objeto);
  }

}
