import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FiltroBusquedaCAPS } from 'src/app/shared/models/historia-clinica/FiltroBusquedaCAPS';

@Injectable({
  providedIn: 'root'
})
export class CapsService {

  private endpoint: string = environment.urlHistoriaClinica + 'Caps';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  obtenerCAPS(objeto: FiltroBusquedaCAPS): Observable<any> {
    return this.http.post<any>(this.endpoint + "/buscar", objeto, {
      headers: this.cabeceras,
    });
  }
}