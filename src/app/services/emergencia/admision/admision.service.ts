import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import { HttpHeadersService } from "../../http-headers.service";
var headers;

@Injectable({
  providedIn: 'root'
})
export class AdmisionService {

  public edadMinimaSelected$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public edadMaximaSeleted$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private urlEmergencia: string = environment.urlEmergencia;
  public admisionSelected$: BehaviorSubject<any> = new BehaviorSubject<any>("");
  constructor(private http: HttpClient, private header: HttpHeadersService) {} //

  public getSetAdmision(objAdmision: any): void {
    //debugger;
    //person.mostrar = true;
    this.admisionSelected$.next(objAdmision);
    //console.log("subjet tiene valor? ", this.admisionSelected$.value);
  }

  ObtenerBuzonRegistroAdmision(objAdmision: any) {
    //http://localhost:8787/wsemergencia/v1/emergencia/gestion/admision/filtro
    headers = this.header.ObtenerCabecera();
    if (headers) {
      let url: string = `${this.urlEmergencia}admision/filtro`;
      return this.http.post(url, objAdmision, { headers }).pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
    }
  }

  public setedadMinima(edad: any): void {
    this.edadMinimaSelected$.next(edad);
    //}
  }
  public setedadMaxima(edad: any): void {
    this.edadMinimaSelected$.next(edad);
    //}
  }

  admisionesPacienteUnidad(filtro: any): Observable<any> {
    //http://localhost:8787/wsemergencia/v1/emergencia/gestion/admision/filtro
    headers = this.header.ObtenerCabecera();
    if (headers) {
      let url: string = `${this.urlEmergencia}admision/filtro`;
      return this.http.post(url, filtro, { headers }).pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
    }
  }

  crearAdmision(objAdmision: any) {
    //http://localhost:8787/wsemergencia/v1/emergencia/gestion/admision/filtro
    headers = this.header.ObtenerCabecera();
    if (headers) {
      let url: string = `${this.urlEmergencia}admision`; 
      return this.http.post(url, objAdmision, { headers }).pipe(
        catchError((e) => {          
          return throwError(e);
        })
      );
    }
  }

  actualizarAdmision(objAdmision: any) {
    //http://localhost:8787/wsemergencia/v1/emergencia/gestion/admision/filtro
    headers = this.header.ObtenerCabecera();
    if (headers) {
      let url: string = `${this.urlEmergencia}admision`;
      return this.http.put(url, objAdmision, { headers }).pipe(
        catchError((e) => {          
          return throwError(e);
        })
      );
    }
  }

  ObtenerDatosConsultaEmergencia(    
    admisionId?: number,
    admisionServicioId?: number,
  ): Observable<any> {
    // console.log(this.urlEmergencia +
    //   "consulta/obtenerDatosConsultaEmergencia/" +
    //   admisionId +
    //   "/" +
    //   admisionServicioId);
    
    //consulta/obtenerDatosConsultaEmergencia
    headers = this.header.ObtenerCabecera();
    if (headers) {
      return this.http
        .get(
          this.urlEmergencia +
            "consulta/obtenerDatosConsultaEmergencia/" +
            admisionId +
            "/" +
            admisionServicioId            
        )
        .pipe(
          catchError((e) => {
            Swal.fire("Error", "Ha ocurrido un error en la información", "error");
            return throwError(e);
          })
        );
    }
  }
}
