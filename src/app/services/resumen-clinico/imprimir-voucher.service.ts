import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImprimirVoucherService {
  private endpoint: string =
  environment.urlHistoriaClinica + 'ResumenClinico/Visualizar/';
private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public visualizarVoucher(parametro: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'boucher', parametro, {
      headers: this.cabeceras,
    });
  }
}
