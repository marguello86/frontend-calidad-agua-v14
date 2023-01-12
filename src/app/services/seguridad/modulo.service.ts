import { Injectable } from '@angular/core';
import { RestApiClient } from '../rest-api/rest-api-client';
import { environment } from 'src/environments/environment';
import { RestApiUtils } from '../rest-api/rest-api-utils';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuloService extends RestApiClient<any> {
  protected endpoint: string = environment.urlSeguridad + 'gestion-catalogos/modulos/';

  private moduleSelected$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(http: HttpClient) { super(http); }

  obtenerPorCodigo(code: string): Observable<ApiRespuesta<any>> {
    return this.http.get<ApiRespuesta<any>>(this.endpoint + 'codigo/' + code, RestApiUtils.httpGetOptions).pipe(
      map(RestApiUtils.extractData)
    );
  }

  setModuleSelected(modulo: any): void { this.moduleSelected$.next(modulo); }

  getModuleSelected(): Observable<any> { return this.moduleSelected$.asObservable(); }

}
