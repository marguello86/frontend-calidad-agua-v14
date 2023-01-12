import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExamenesFisicosService {
  private endpiont = environment.urlHistoriaClinica + 'ExamenesFisicos/';
  private cabeceras = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(private http: HttpClient) {}

  guardarExamenesFisicos(valor: any): Observable<any> {
    return this.http.post<any>(this.endpiont + 'crear', valor, {
      headers: this.cabeceras,
    });
  }
  ActualizarExamenesFisicos(valor: any): Observable<any> {
    return this.http.put<any>(this.endpiont + 'actualizar', valor, {
      headers: this.cabeceras,
    });
  }
  EliminarExamenesFisicos(valor: any): Observable<any> {
    return this.http.put<any>(this.endpiont + 'actualizarEstado', valor, {
      headers: this.cabeceras,
    });
  }
}
