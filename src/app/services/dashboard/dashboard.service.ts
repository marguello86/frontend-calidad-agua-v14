import { environment } from "./../../../environments/environment";
import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { LocalStorageAdminService } from "../local-storage-admin.service";
import { Observable, throwError, Subject, BehaviorSubject } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DashboardService extends LocalStorageAdminService {
  urlPrincipal = environment.urlWsVigilanciaMinsa;
  urlDash = "gestion/reportes/dashboard";
  urlEndpoint = this.urlPrincipal + this.urlDash;
  constructor(private http: HttpClient, private router: Router) {
    super();
  }

  obtieneValoresDB(objetoCaptReg: any): Observable<any> {
    return this.http.post(this.urlEndpoint, objetoCaptReg).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }
}
