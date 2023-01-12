import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadPorUnidadSaludService {
  private endpoint: string =
    environment.urlWsHospitalario + 'unisaludservicios/';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });
  

  constructor(private http: HttpClient) { }

  public buscarServicioPorUnidadSalud(): Observable<any> {
    // let unidadID =  new Unidad();
    const unidadID = JSON.parse(localStorage.getItem('unidadUsuarioeEmg')).unidad.id; 
    return this.http.get<any>(this.endpoint + unidadID, {
      headers: this.cabeceras,
    });
  }
}
