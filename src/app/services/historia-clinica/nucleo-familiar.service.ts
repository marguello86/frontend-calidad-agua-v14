import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NucleoFamiliarService {
  private endpoint: string = environment.urlHistoriaClinica + 'NucleoFamiliar/';
  cabeceras = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  guardarNucleo(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'crear', objeto, {
      headers: this.cabeceras,
    });
  }

  actualizarNucleo(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizar', objeto, {
      headers: this.cabeceras,
    });
  }

  eliminarNucleo(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizarEstado', objeto, {
      headers: this.cabeceras,
    });
  }
}
