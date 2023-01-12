import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AntecedentesNoPatologicosService {
  private endpoint =
    environment.urlHistoriaClinica + 'AntecedentesNoPatologicos/';
  private cabezereas = new HttpHeaders({ 'Content/Type': 'application/json' });

  constructor(private http: HttpClient) {}

  public guardarHabitos(habito: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'Habitos/crear', habito, {
      headers: this.cabezereas,
    });
  }
  public actualizarHabitos(habito: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'Habitos/actualizar', habito, {
      headers: this.cabezereas,
    });
  }

  public guardarConsumo(consumo: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'Consumo/crear', consumo, {
      headers: this.cabezereas,
    });
  }
  public eliminarConsumo(consumo: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'Consumo/actualizarEstado', consumo, {
      headers: this.cabezereas,
    });
  }
  public actualizarConsumo(consumo: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'Consumo/actualizar', consumo, {
      headers: this.cabezereas,
    });
  }
}
