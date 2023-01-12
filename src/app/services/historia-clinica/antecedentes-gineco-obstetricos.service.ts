import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AntecedentesGinecoObstetricosService {
  private endpoint: string = environment.urlHistoriaClinica + 'AntecedentesGinecoUrologicos';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public guardarAntGinecoObstetricos(antGinecoObst: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/crear', antGinecoObst, {
      headers: this.cabeceras,
    });
  }
}
