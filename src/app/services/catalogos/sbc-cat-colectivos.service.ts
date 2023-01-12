import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { environment } from 'src/environments/environment';
import { RestApiUtils } from '../rest-api/rest-api-utils';



@Injectable()
export class SbcCatColectivosService implements OnDestroy {
  protected endpoint: string = environment.urlWsCatalogosMinsa + 'gestion-catalogos/catalogos/';

  constructor(protected http: HttpClient) { }

  obtenerPorId(id: number): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'cat/' + id.toString(), RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  obtenerPorIdSuperior(idSup: number): Observable<ApiRespuesta<Catalogo>> {
    return this.obtenerPorTipo('SUP', idSup);
  }

  obtenerPorTipo(tipo: string, id: number): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'tipo/' + id.toString() + '/' + tipo, RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  obtenerPorCodigo(codigo: string): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'codigo/' + codigo + '/0', RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  obtenerPorCodigoSuperior(codigoSup: string): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'codigo/' + codigoSup + '/1', RestApiUtils.httpGetOptions)
      .pipe(map(RestApiUtils.extractData));
  }

  ngOnDestroy() { }
}
