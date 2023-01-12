import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AntecedentesPatologicosFamiliares } from 'src/app/shared/models/historia-clinica/antecedentes-patologicos-familiares';

@Injectable({
  providedIn: 'root',
})
export class AntecedentesFamiliaresService {
  private endpoint: string =
    environment.urlHistoriaClinica + 'AntecedentesPatologicos/Familiares/';
  cabeceras = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  guardarAntecedentesFamiliares(objeto: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'crear', objeto, {
      headers: this.cabeceras,
    });
  }

  eliminarAntecedentesFamiliares(objeto: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizarEstado', objeto, {
      headers: this.cabeceras,
    });
  }
}
