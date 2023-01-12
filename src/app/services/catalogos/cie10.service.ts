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
export class Cie10Service extends RestApiClient<any> {
  protected endpoint: string = environment.urlWsHospitalario + 'catcie10/';

  constructor(http: HttpClient) { super(http); }


  obtenerCriteriosCadena(...criterio: string[]): Observable<ApiRespuesta<any>> {
    return this.http.get<ApiRespuesta<any>>(this.endpoint + criterio.join('/'), RestApiUtils.httpGetOptions).pipe(
      map(RestApiUtils.extractData)
    );
  }

}
