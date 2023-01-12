import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageAdminService } from '../services/service.index';
import { JWT } from '../services/constantes';

@Injectable({
  providedIn: 'root'
})
export class InterceptortokenService extends LocalStorageAdminService implements HttpInterceptor {

  constructor() { super(); }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.getLocalStorageItem(JWT));

    const reqClone = req.clone({
      headers
    });
    return next.handle(reqClone);
  }
}
