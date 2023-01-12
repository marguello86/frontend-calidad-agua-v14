import { Injectable } from '@angular/core';
import { RestApiClient } from '../rest-api/rest-api-client';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { RestApiUtils } from '../rest-api/rest-api-utils';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SistemaService extends RestApiClient<any> {
  protected endpoint: string = environment.urlSeguridad + 'gestion-catalogos/sistemas/';

  constructor(http: HttpClient) { super(http); }

  obtenerPorCodigo(code: string): Observable<ApiRespuesta<any>> {
    return this.http.get<ApiRespuesta<any>>(this.endpoint + 'codigo/' + code, RestApiUtils.httpGetOptions).pipe(
      map(RestApiUtils.extractData)
    );
  }

}
