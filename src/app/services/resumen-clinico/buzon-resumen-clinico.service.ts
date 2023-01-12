import { LocalStorageAdminService } from 'src/app/services/service.index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BuzonResumenClinicoService extends LocalStorageAdminService {
  private endpoint: string =
    environment.urlHistoriaClinica + 'ResumenClinico/Visualizar/';
  private cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {
    super();
  }

  public buscarBuzonDeSolicitudes(buzonSol: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'Buzon', buzonSol, {
      headers: this.cabeceras,
    });
  }

  public imprimirBoucher(antecedente: any): Observable<any> {
    return this.http.post<any>(this.endpoint + 'boucher', antecedente, {
      headers: this.cabeceras,
    });
  }

  public buscarSolicitud(id: number): Observable<any> {
    return this.http.get<any>(this.endpoint + 'Solicitud/' + id);
  }

  public EntregarResumenClinico(resumen: any): Observable<any> {
    return this.http.post<any>(
      environment.urlHistoriaClinica + 'ResumenClinico/Entrega/crear',
      resumen,
      {
        headers: this.cabeceras,
      }
    );
  }

  imprimirResumenClinico(id: any): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    return this.http.post<any>(
      environment.urlHistoriaClinica + 'ResumenClinico/visualizarReporte/',
      id,
      httpOptions
    );
  }
}
