import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { environment } from 'src/environments/environment';
import { RestApiUtils } from '../rest-api/rest-api-utils';


@Injectable({
  providedIn: 'root'
})
export class SnhCatEntidadesService implements OnDestroy {
  protected endpoint: string = environment.urlWsHospitalario + 'catalogos/';
  protected url: string = environment.urlWsHospitalario;

  constructor(protected http: HttpClient) { }

  obtenerPorId(entidad: string, id?: number): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + entidad + '/' + (id ? id : 0), RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  ObtenerCatalogoPorCodigo(codigo: string, id?: number): Observable<ApiRespuesta<Catalogo>> {
    let url: string = `${this.url}/gestion-catalogos/catalogos/codigo/${codigo}/${id}`;
    return this.http.get(url).pipe(retry(5), map((response: any) => {
      //debugger
      return response;
    }));

  }

  ngOnDestroy() { }
}
