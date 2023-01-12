import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResumenClinicoService {
  private endpoint: string =
    environment.urlHistoriaClinica + 'ResumenClinico/Detalle/';
  private cabezereas: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  public crearResumenClinico(resumen: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'crear', resumen, {
      headers: this.cabezereas,
    });
  }
  public editarResumenClinico(resumen: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizar', resumen, {
      headers: this.cabezereas,
    });
  }
  public eliminarResumenClinico(resumen: any): Observable<any> {
    return this.http.put<any>(this.endpoint + 'actualizarEstado', resumen, {
      headers: this.cabezereas,
    });
  }
  public finalizarResumenClinico(resumen: any): Observable<any> {
    return this.http.put<any>(
      environment.urlHistoriaClinica + 'ResumenClinico/FinalizarSolicitud',
      resumen,
      {
        headers: this.cabezereas,
      }
    );
  }
}
