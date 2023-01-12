import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, shareReplay, throwError } from 'rxjs';
import { FiltroBusquedaSignosVitales } from 'src/app/shared/models/historia-clinica/FiltroBusquedaSignosVitales';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {

  private endpoint: string = environment.urlEmergencia ;
  cabeceras = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  obtenerAdmisiones(objeto: FiltroBusquedaSignosVitales): Observable<any> {
    return this.http.post<any>(this.endpoint + 'admision/filtro', objeto, {
      headers: this.cabeceras,
    });
  }

  ObtenerDatosClinicosXAdmisionId(admisionId: number): Observable<any> {  
    return this.http.get(this.endpoint + "DatosClinicos/" + admisionId + '/0/0')
    .pipe(retry(2),map((response)=>{return response;}),  
           catchError((e) => { return throwError(e);}),
           shareReplay()      
    );
  }
}
