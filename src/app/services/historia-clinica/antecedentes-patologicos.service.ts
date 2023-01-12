import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AntecedentesPatologicosService {
  private endpoint: string =
    environment.urlHistoriaClinica + 'AntecedentesPatologicos/Personales';
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  guardarAntecedentePatologico(antecedente: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/crear', antecedente, {
      headers: this.cabeceras,
    });
  }

  actualizarRegistro(antecedente: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/actualizar', antecedente, {
      headers: this.cabeceras,
    });
  }

  eliminarAnctecedente(estado: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/actualizarEstado', estado, {
      headers: this.cabeceras,
    });
  }
}
