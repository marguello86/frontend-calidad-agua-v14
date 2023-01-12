import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroBusquedaDetalleVacuna } from 'src/app/shared/models/historia-clinica/filtro-busqueda-detalle-vacuna';
import { FiltroBusquedaEsquemaCOVID } from 'src/app/shared/models/historia-clinica/filtro-busqueda-esquema-covid';
import { FiltroBusquedaEsquemaVacunacion } from 'src/app/shared/models/historia-clinica/filtro-busqueda-esquema-vacunacion';
import { FiltroProximaVacuna } from 'src/app/shared/models/historia-clinica/filtro-proxima-vacuna';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EsquemaVacunasService {

  private endpoint1: string = environment.urlSIPAI + 'v1/sipai/';
  private endpoint2: string = environment.urlSIPAI + 'v2/sipai/';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  obtenerNominalEsquemaVacunacion(objeto: FiltroBusquedaEsquemaVacunacion): Observable<any> {
    return this.http.post<any>(this.endpoint2 + "esquemavacunacion/gestion/registronominal/buscar", objeto, {
      headers: this.cabeceras,
    });
  }
  obtenerDetalleVacuna(objeto: FiltroBusquedaDetalleVacuna): Observable<any> {
    return this.http.post<any>(this.endpoint2 + "esquemavacunacion/gestion/obtenerDetalleVacuna/filtrar", objeto, {
      headers: this.cabeceras,
    });
  }
  obtenerNominalCOVID(objeto: FiltroBusquedaEsquemaCOVID): Observable<any> {
    return this.http.post<any>(this.endpoint1 + "gestion/obtenernominal", objeto, {
      headers: this.cabeceras,
    });
  }
  obtenerProximasVacunas(objeto: FiltroProximaVacuna): Observable<any> {
    return this.http.post<any>(this.endpoint2 + "esquemavacunacion/gestion/proximacitavacuna/buscar", objeto, {
      headers: this.cabeceras,
    });
  }
}