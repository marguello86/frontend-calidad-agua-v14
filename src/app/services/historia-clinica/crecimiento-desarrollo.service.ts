import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrecimientoDesarrolloService {
  private endpoint: string = environment.urlHistoriaClinica + 'CrecimientoDesarrollo';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  /**ALIMENTACION PEDIATRICA */
  guardarAlimentacionPediatrica(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "/AlimentacionPediatrica/crear", objeto, {
      headers: this.cabeceras,
    });
  }
  actualizarAlimentacionPediatrica(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + "/AlimentacionPediatrica/actualizar", objeto, {
      headers: this.cabeceras,
    });
  }
  eliminarAlimentacionPedriatrica(objeto: any): Observable<any> {
    return this.http.delete<any>(this.endpoint + "/AlimentacionPediatrica/actualizarEstado", objeto);
  }
  /**ANTECEDENTES DEL PARTO */
  guardarAntecedentesDelParto(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "/AntecedentesDelParto/crear", objeto, {
      headers: this.cabeceras,
    });
  }
  actualizarAntecedenteDelParto(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + "/AntecedentesDelParto/actualizar", objeto, {
      headers: this.cabeceras,
    });
  }
  eliminarAntecedentesDelParto(objeto: any): Observable<any> {
    return this.http.delete<any>(this.endpoint + "/AntecedentesDelParto/actualizarEstado", objeto);
  }

  /**ANTECEDENTES DEL PARTO */
  guardarAntecedentesPostnatales(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "/AntecedentesPostnatales/crear", objeto, {
      headers: this.cabeceras,
    });
  }
  actualizarAntecedentesPostnatales(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + "/AntecedentesPostnatales/actualizar", objeto, {
      headers: this.cabeceras,
    });
  }
  eliminarAntecedentesPostnatales(objeto: any): Observable<any> {
    return this.http.delete<any>(this.endpoint + "/AntecedentesPostnatales/actualizarEstado", objeto);
  }

  /**ANTECEDENTES PSICOMOTOR */
  guardarAntecedentesPsicomotor(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + "/AntecedentesPsicomotor/crear", objeto, {
      headers: this.cabeceras,
    });
  }
  actualizarAntecedentesPsicomotor(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + "/AntecedentesPsicomotor/actualizar", objeto, {
      headers: this.cabeceras,
    });
  }
  eliminarAntecedentesPsicomotor(objeto: any): Observable<any> {
    return this.http.delete<any>(this.endpoint + "/AntecedentesPsicomotor/actualizarEstado", objeto);
  }
}
