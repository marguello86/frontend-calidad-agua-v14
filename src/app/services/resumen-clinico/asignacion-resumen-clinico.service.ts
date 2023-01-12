import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AsignacionResumenClinicoService {
  private endpoint: string =
    environment.urlHistoriaClinica + 'ResumenClinico/Asignacion/';
  private cabezereas: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  public crearAsignacionMedico(asignacion: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'crear', asignacion, {
      headers: this.cabezereas,
    });
  }
}
