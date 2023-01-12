import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FiltroBusquedaConsultas } from 'src/app/shared/models/historia-clinica/filtro-busqueda-consulta';

@Injectable({
  providedIn: 'root'
})

export class ConsultaEmergenciaService {

  private endpoint: string = environment.urlEmergencia + 'consulta';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  obtenerConsultasEmergencia(objeto: FiltroBusquedaConsultas): Observable<any> {
    return this.http.post<any>(this.endpoint + "/generarReporteConsultaEmergencia", objeto, {
      headers: this.cabeceras,
    });
  }
}
