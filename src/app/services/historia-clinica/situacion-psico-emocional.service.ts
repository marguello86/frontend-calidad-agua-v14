import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SituacionPsicoEmocionalService {
  private endopoint: string =
    environment.urlHistoriaClinica + 'SituacionPsicoEmocional';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  public guardarAntecedente(antecedente: any): Observable<any> {
    return this.http.post<any>(this.endopoint + '/crear', antecedente, {
      headers: this.cabeceras,
    });
  }

  public actualizarAntecedente(antecedente: any): Observable<any> {
    return this.http.put<any>(this.endopoint + '/actualizar', antecedente, {
      headers: this.cabeceras,
    });
  }

  public eliminarDetalle(antecedente: any): Observable<any> {
    return this.http.put<any>(
      this.endopoint + '/actualizarEstado',
      antecedente,
      {
        headers: this.cabeceras,
      }
    );
  }
}
