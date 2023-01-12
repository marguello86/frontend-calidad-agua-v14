import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { RestApiCore } from './rest-api-core';
import { RestApiUtils } from './rest-api-utils';
import { restAppConfig } from './rest-app.config';


export abstract class RestApiClient<T extends Catalogo> extends RestApiCore {
  protected abstract endpoint: string;

  constructor(http: HttpClient) { super(http); }

  obtenerTodos(): Observable<ApiRespuesta<T>> { return this.obtenerPorId(0); }

  obtenerPorId(id: number): Observable<ApiRespuesta<T>> {
    return this.http.get<ApiRespuesta<T>>(this.endpoint + id.toString(), RestApiUtils.httpGetOptions).pipe(
      map(RestApiUtils.extractData)
    );
  }

  obtenerPorReferencia(...id: number[]): Observable<ApiRespuesta<T>> {
    return this.http.get<ApiRespuesta<T>>(this.endpoint + id.join('/'), RestApiUtils.httpGetOptions).pipe(
      map(RestApiUtils.extractData)
    );
  }

  registrar(entidad: T, wrapper: boolean = true): Observable<ApiRespuesta<T>> {
    return this.http.post<ApiRespuesta<T>>(this.endpoint, null, RestApiUtils.httpOptions);
  }

  actualizar(entidad: T): Observable<ApiRespuesta<T>> {
    return this.http.put<ApiRespuesta<T>>(this.endpoint, null, RestApiUtils.httpOptions);
  }

  eliminar(id: number): Observable<ApiRespuesta<T>> {
    return this.http.delete<ApiRespuesta<T>>(this.endpoint + id.toString(), RestApiUtils.httpOptions);
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (restAppConfig.logger.http.error) {
        console.error(`${operation} failed: ${error ? error.message : error}`);
      }
      return of(result as T);
    };
  }
}
