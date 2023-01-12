import { Injectable } from '@angular/core';
import { RestApiClient } from '../rest-api/rest-api-client';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolService extends RestApiClient<any> {
  protected endpoint: string = environment.urlSeguridad + 'gestion-catalogos/roles/';

  constructor(http: HttpClient) { super(http); }

  getRoleBySystem(systemId: number): Observable<any> | Observable<string> {
    return this.http.get(this.endpoint + 'sistema/' + systemId)
      .pipe(map((r: any) => {
        if (r.data) {
          return r.data;
        } else { return r.error; }
      }));
  }

}
