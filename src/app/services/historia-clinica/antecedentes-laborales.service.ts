import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AntecedentesLaboralesService {
  private endpoint: string =
    environment.urlHistoriaClinica + 'AntecedentesLaborales/';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  public guardarAntecedenteLaboral(antecedente: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'crear', antecedente, {
      headers: this.cabeceras,
    });
  }
  public actualizarAntecedenteLaboral(antecedente: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizar', antecedente, {
      headers: this.cabeceras,
    });
  }
}
