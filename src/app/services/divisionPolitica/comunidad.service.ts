import { Injectable } from '@angular/core';
import { RestApiClient } from '../rest-api/rest-api-client';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService extends RestApiClient<any> {
  protected endpoint: string = environment.urlWsCatalogosMinsa + 'gestion-divpolitica/comunidad/';

  constructor(http: HttpClient) {
    super(http);
  }

}
