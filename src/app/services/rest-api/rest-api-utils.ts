import { HttpHeaders } from '@angular/common/http';

export class RestApiUtils {
  static readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json; charset=UTF-8'
    })
  };

  static readonly httpGetOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json; charset=UTF-8'
    })
  };

  static extractData<T>(res: T, index?: number): T {
    const body = res;
    return body || null;
  }
}
