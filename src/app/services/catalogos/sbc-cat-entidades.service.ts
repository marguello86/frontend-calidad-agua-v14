import { Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiUtils } from '../rest-api/rest-api-utils';
import { environment } from 'src/environments/environment';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';

@Injectable()
export class SbcCatEntidadesService implements OnDestroy {
  protected endpoint: string = environment.urlWsCatalogosMinsa;

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

  obtenerPorReferenciaId(entidad: string, referencia: string, id?: number): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + entidad + '/' + referencia + '/' + (id ? id : 0), RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }

  obtenerPorNombre(entidad: string, nombre: string): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + entidad + 'nombre/' + nombre, RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }
  obtenerPorCodigo(entidad: string, pId?: string): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'gestion-catalogos/catalogos/codigo/' + entidad + '/' + pId,
      RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }

  ngOnDestroy() { }
}
