import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestApiClient } from '../rest-api/rest-api-client';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends RestApiClient<any> {
  protected endpoint: string = environment.urlWsCatalogosMinsa + 'red-servicios/sectores/';

  constructor(http: HttpClient) { super(http); }
}
