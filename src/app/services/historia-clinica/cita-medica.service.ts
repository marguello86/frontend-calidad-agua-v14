import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FiltroBusquedaCitaMedica } from 'src/app/shared/models/historia-clinica/FiltroBusquedaCitaMedica';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CitaMedicaService {
 
  private endpoint: string = environment.urlHistoriaClinica + 'Citas';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  obtenerCitaMedica(objeto: FiltroBusquedaCitaMedica): Observable<any> {
    return this.http.post<any>(this.endpoint + "/buscar", objeto, {
      headers: this.cabeceras,
    });
  }
}
