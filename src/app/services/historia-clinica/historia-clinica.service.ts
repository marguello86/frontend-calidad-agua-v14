import { Observable } from 'rxjs';
import { FiltroBusquedaHistoriaClinica } from './../../shared/models/historia-clinica/filtro-busqueda-historia-clinica';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageAdminService } from '../local-storage-admin.service';
import { FiltroBuzonNominalHC } from 'src/app/shared/models/historia-clinica/filtro-buzon-nominal-hc';

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaService extends LocalStorageAdminService {
  private endpoint: string = environment.urlHistoriaClinica + 'Buzon';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {
    super();
  }

  getItemHistoriaClinica(
    parametro: FiltroBusquedaHistoriaClinica
  ): Observable<any> {
    return this.http.post<any>(
      this.endpoint + '/buscarHistoriasClinicas',
      parametro,
      {
        headers: this.cabeceras,
      }
    );
  }

  getHistoriaClinica(
    parametro: FiltroBusquedaHistoriaClinica
  ): Observable<any> {
    return this.http.post<any>(
      this.endpoint + '/buscarBuzondePaciente',
      parametro,
      {
        headers: this.cabeceras,
      }
    );
  }

  guardarHistoriaClinica(objeto: any): Observable<any> {
    return this.http.post<any>(
      this.endpoint + '/crearHistoriasClinica',
      objeto,
      {
        headers: this.cabeceras,
      }
    );
  }

  guardarDetalleHistoriaClinica(objeto: any): Observable<any> {
    return this.http.post<any>(
      this.endpoint + '/detalle/crearDetalleHistoriasClinica',
      objeto,
      {
        headers: this.cabeceras,
      }
    );
  }

  actualizarDetalleHistoriaClinica(objeto: any): Observable<any> {
    return this.http.put<any>(
      this.endpoint + '/detalle/actualizarDetalleHistoriasClinicas',
      objeto,
      {
        headers: this.cabeceras,
      }
    );
  }

  buscarDetalleHistoriaClinica(objeto: any): Observable<any> {
    return this.http.post<any>(
      this.endpoint + '/detalle/buscarHistoriasClinicas',
      objeto,
      {
        headers: this.cabeceras,
      }
    );
  }

  obtenerRegistrosHistoriaClinica(
    objeto: FiltroBuzonNominalHC
  ): Observable<any> {
    return this.http.post<any>(
      this.endpoint + '/buscarBuzondePaciente',
      objeto,
      {
        headers: this.cabeceras,
      }
    );
  }

  eliminarHistoriaClinica(objeto: any): Observable<any> {
    return this.http.put<any>(
      this.endpoint + '/actualizarEstadoHistoriasClinicas',
      objeto,
      {
        headers: this.cabeceras,
      }
    );
  }

  imprimirHistoriaClinica(id: any): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    return this.http.post<any>(
      environment.urlHistoriaClinica + 'HistoriaClinica/visualizarReporte/',
      id,
      httpOptions
    );
  }
}
