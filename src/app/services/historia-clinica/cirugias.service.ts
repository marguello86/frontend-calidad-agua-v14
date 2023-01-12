import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroBusquedaCirugia } from 'src/app/shared/models/historia-clinica/filtro-busqueda-cirugia';

@Injectable({
  providedIn: 'root'
})
export class CirugiasService {

  private endpoint1: string = environment.urlCirugia;
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  obtenerRegistrosCirugias(objeto: FiltroBusquedaCirugia): Observable<any> {
    return this.http.post<any>(this.endpoint1 + "cirugiaBuscar", objeto, {
      headers: this.cabeceras,
    });
  }
}
