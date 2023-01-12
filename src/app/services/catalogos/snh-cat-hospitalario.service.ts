import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { RestApiUtils } from '../rest-api/rest-api-utils';




@Injectable({
  providedIn: 'root'
})
export class SnhCatHospitalarioService {
  protected endpoint: string = environment.urlWsHospitalario;
  private codigo: string = 'CRCPX';
  constructor(protected http: HttpClient) { }

  obtenerPorId(entidad: string, pId?: string): Observable<ApiRespuesta<Catalogo>> {
    const id: string = (pId || pId === '0' ? pId : '');
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + entidad + (id || id === '0' ? '/' + id : ''), RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }
  obtenerPorId1(entidad: string, pId?: string): Observable<ApiRespuesta<Catalogo>> {
    const id: string = (entidad || entidad === '1202' ? entidad : '');
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'catalogos/cat/' + entidad + (id || id === '1202' ? '/' + pId : ''), RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }
  obtenerPorCodigo(entidad: string, pId?: string): Observable<ApiRespuesta<Catalogo>> {
    const id: string = (entidad || entidad === this.codigo ? entidad : '');
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'gestion-catalogos/catalogos/codigo/' + entidad + (id || id === this.codigo ? '/' + pId : ''),
      RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }
}
