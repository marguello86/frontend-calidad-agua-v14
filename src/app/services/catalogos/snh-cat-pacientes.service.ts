import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { environment } from 'src/environments/environment';
import { RestApiUtils } from '../rest-api/rest-api-utils';

@Injectable()
export class SnhCatPacientesService implements OnDestroy {
  protected endpoint: string = environment.urlPaciente + 'entidades/';

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
      this.endpoint + 'fk/' + entidad + '/' + referencia + '/' + (id ? id : 0), RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  obtenerPorFiltroPersonalizado(entidad: string, filtro: string, filtroValor: string): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'ct/' + entidad + '/' + filtro + '/' + filtroValor, RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  ngOnDestroy() { }
}
