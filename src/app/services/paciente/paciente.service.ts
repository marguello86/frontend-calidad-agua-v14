import { Injectable } from "@angular/core";
import { RestApiClient } from "../rest-api/rest-api-client";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { ApiRespuesta } from "src/app/shared/models/rest-api/api-respuesta";
import { RestApiUtils } from "../rest-api/rest-api-utils";
import { MstPaciente } from "src/app/shared/models/pacientes/mst-paciente";
import { PersonaMinsa } from "src/app/shared/models/minsa-personal/minsaPersonal.models";
import { Paciente } from "src/app/shared/models/persona/persona.models";
//import { StorageService } from "angular-webstorage-service";
import { ParametrosEdades } from "src/app/shared/models/pacientes/parametros-edades";

@Injectable({
  providedIn: "root",
})
export class PacienteService extends RestApiClient<any> {
  getLocalData(arg0: string) {
    throw new Error("Method not implemented.");
  }
  protected endpoint: string = environment.urlPaciente + "pacientes/";
  protected endpointExpedientes: string =
    environment.urlPaciente + "paciente-expediente-locales/";
  protected endpointContactosPaciente: string =
    environment.urlPaciente + "paciente-contactos/";
  public contactoSelected$: BehaviorSubject<PersonaMinsa> = new BehaviorSubject<any>(
    ""
  );
  public parametrosEdades: BehaviorSubject<ParametrosEdades> = new BehaviorSubject<ParametrosEdades>(null);

  constructor(http: HttpClient) { super(http); }
  obtenerExpedientesLocales(
    idPaciente: number
  ): Observable<ApiRespuesta<MstPaciente>> {
    if (!this.isLogged(null)) {
      return null;
    }
    return this.http
      .get<ApiRespuesta<MstPaciente>>(
        this.endpointExpedientes + "paciente/" + idPaciente
      )
      .pipe(map(RestApiUtils.extractData));
  }

  confirmarPaciente(id: number, obj: any): Observable<any> {
    //console.log('service confirmarPaciente id: ', id, ' service obj: ', obj);
    return this.http.put(this.endpoint + id + "/precargado", obj).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  obtenerPacientePorExpediente(expediente: string): Observable<any> {
    return this.http
      .get<ApiRespuesta<MstPaciente>>(
        this.endpoint + "expediente/" + expediente
      )
      .pipe(map(RestApiUtils.extractData));
  }

  obtenerContactosPaciente(
    idPaciente: number
  ): Observable<ApiRespuesta<MstPaciente>> {
    if (!this.isLogged(null)) {
      return null;
    }

    return this.http
      .get<ApiRespuesta<MstPaciente>>(
        this.endpointContactosPaciente + "paciente/" + idPaciente
      )
      .pipe(map(RestApiUtils.extractData));
  }

  public setContactoSeleccionado(objContacto: PersonaMinsa): void {
    this.contactoSelected$.next(objContacto);
  }

  insertarContactoPaciente(objContacto: any): Observable<any> {
    console.info("insertarContactoPaciente service: ", JSON.stringify(objContacto, null, 2));
    //return null
    // console.log('endpointContactosPaciente: ', this.endpointContactosPaciente);
    return this.http.post(this.endpointContactosPaciente, objContacto).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  actualizarContactoPaciente(objContacto: any): Observable<any> {
    //console.info("actualizarContactoPaciente: ", objContacto);
    return this.http.put(this.endpointContactosPaciente, objContacto).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  pasivarContactoPaciente(objContacto: any): Observable<any> {
    //console.info("pasivarContactoPaciente service: ", objContacto);
    return this.http.put(this.endpointContactosPaciente, objContacto).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }
}
