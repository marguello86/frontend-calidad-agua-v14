import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
//import { DatosResidencia } from 'src/app/shared/components/catalogos/persona-data-ubc-res/datos-residencia';
//import { PersonaEmergencia } from 'src/app/shared/components/persona/crear-persona/persona-emergencia';
import { LONGITUD_PRIMER_BLOQUE, PRIMER_BLOQUE_CEDULA_EXT, ROWS_PER_PAGE_API, FIRST_PAGE_API } from 'src/app/shared/components/persona/persona.const';
import { DatosDeEnvio, SalidaDatosPersonal } from 'src/app/shared/models/minsa-personal/minsaPersonal.models';
import { Persona, ResponseBodyRequest, TipoBusqueda } from 'src/app/shared/models/persona/persona.models';
import { environment } from 'src/environments/environment';
import { LocalStorageAdminService } from '../local-storage-admin.service';

@Injectable({
  providedIn: 'root'
})

export class PersonaService extends LocalStorageAdminService {

  private url: string = environment.urlPersona;
  private urlEmergencia: string = environment.urlEmergencia;
  private urlPersonales: string = environment.urlMinsaPersonales;

  public personSelected$: BehaviorSubject<Persona> = new BehaviorSubject<any>('');
  public tipoBusqueda$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public personaSeleccionada$: BehaviorSubject<SalidaDatosPersonal> = new BehaviorSubject<any>('');
  public allowCreatePerson$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public criteriaLookUp$: BehaviorSubject<ResponseBodyRequest> = new BehaviorSubject<ResponseBodyRequest>(null);
  public resultadoBusquedaPersona$: BehaviorSubject<TipoBusqueda> = new BehaviorSubject<TipoBusqueda>(null);
  //public resultadoRecienNacido$: BehaviorSubject<DatosResidencia> = new BehaviorSubject<DatosResidencia>(null);
  constructor(private http: HttpClient) { super(); }

  public searchAdvanced(
    criteria: ResponseBodyRequest
  ): Observable<any> | Observable<string> {
    //debugger;
    return this.http.post(`${this.url}search`, criteria).pipe(
      retry(5),
      map((response: any) => {
        if (response.datos) {
          //console.log(response.datos);
          return {
            paginacion: response.paginacion
              ? response.paginacion
              : {
                pagina: FIRST_PAGE_API,
                cantidadRegistros: response.datos.length,
                paginaRegistros: ROWS_PER_PAGE_API,
                paginasPendientes:
                  response.datos.length > ROWS_PER_PAGE_API
                    ? response.datos.length / ROWS_PER_PAGE_API
                    : 0,
              },
            data: response.datos,
          };
        }
        return response.error.messageUser;
      }),
      shareReplay()
    );
  }

  //2812306740006F 20172 CRISTIAN UREY
  public BusquedaPersonalMinsa(
    criteria: DatosDeEnvio
  ): Observable<any> | Observable<string> {
    let listaPersonal: any = [];
    //debugger;
    //return this.http.post(`${this.urlPersonales}busquedaPorFiltros`, criteria).pipe(
    return this.http.post(`${this.urlPersonales}busquedas`, criteria).pipe(
      retry(5),
      map((response: any) => {
        //debugger;
        if (response.data) {
          listaPersonal = response.data.filter((el) => {
            return el.tipopersonal.codigo === "TIPO_PERSONAL_AS"
          })
          response.data = listaPersonal;
          //console.log(response.data);
          let respuesta = {
            registro: response.rowcount,
            paginacion: {
              pagina: FIRST_PAGE_API,
              cantidadRegistros: response.data.length,
              paginaRegistros: ROWS_PER_PAGE_API,
              paginasPendientes:
                response.data.length > ROWS_PER_PAGE_API
                  ? response.data.length / ROWS_PER_PAGE_API
                  : 0,
            },
            data: response.data,
          };
          return respuesta;
        }
        return response;
      }),
      shareReplay()
    );
  }

  //* ESTABLECER PERSONAL MINSA
  public setPersonSelected(person: any): void {
    //debugger;
    //person.mostrar = true;
    this.personaSeleccionada$.next(person);
  }
  //* ESTABLECER PERSONA
  public setPersonaSeleccionada(person: any): void {
    this.personSelected$.next(person);
    //}
  }
  //* SE ESTABLECE EL TIPO DE BUSQUEDA DE PERSONA
  public setTipoBusqueda(v: string): void {
    this.tipoBusqueda$.next(v);
  }
  //* SE ESTABLECE EL RESULTADO DE LOS STEPPER DE RECIEN NACIDO
  // public setDatosResidencia(v: DatosResidencia): void {
  //   this.resultadoRecienNacido$.next(v);
  // }

  //* SE ESTABLECE EL RESULTADO DE LA BUSQUEDA
  public setResultadoBusqueda(e: TipoBusqueda): void {
    this.resultadoBusquedaPersona$.next(e);
  }

  public numIdentificacionExist(identificacionObj: { id: number, codigo: string, valor: string }): Observable<any> | Observable<string> {
    if (!identificacionObj) { return; }
    const identificacionCoincidence: Persona[] = [];
    const personasCoindenciaName: string = "";
    return this.searchAdvanced({
      datos: { identificacion: { valor: identificacionObj.valor } },
    });
  }

  guardar(persona: Persona): Observable<any> {
    /*console.log('procederemos a consumir endPoint, grabar persona -> ', persona);*/
    return this.http.post(`${this.url}`, { datos: [persona] }).pipe(
      retry(5),
      map((response: any) => {
        if (response.datos) {
          return response.datos;
        }
        return response.error.messageUser;
      }),
      shareReplay()
    );
  }

  // guardarPersonaEmergencia(persona: PersonaEmergencia): Observable<any> {
  //   //debugger;
  //   /*console.log('procederemos a consumir endPoint, grabar persona -> ', persona);*/
  //   return this.http.post(`${this.urlEmergencia}persona`, persona).pipe(
  //     retry(5),
  //     map((response: any) => {
  //       if (response.data) {
  //         return response.data;
  //       }
  //       return response.error.messageUser;
  //     }),
  //     shareReplay()
  //   );
  // }

  private getPersonaSelected() {
    let persona: Persona;
    this.personSelected$.subscribe((p) => {
      if (p) {
        persona = p;
        return persona;
      }
    });
  }

  private validateLastLetterCedulaNicaragua(cedula: string): boolean {
    if (!cedula) {
      return;
    }
    const letters: string = "ABCDEFGHJKLMNPQRSTUVWXY";
    const letterPosition: number = Math.floor(Number(cedula.substr(0, 13)) / 23) * 23;

    if ((Number(cedula.substr(0, 13)) - letterPosition) >= 0 && (Number(cedula.substr(0, 13)) - letterPosition) < 23 ) {

      const lastLetter: string = letters.substr( Number(cedula.substr(0, 13)) - letterPosition, 1 );
      
      if (lastLetter) {
        switch (cedula.substr(13, 1)) {
          case lastLetter:
            return true;
          default:
            return false;
        }
      }
    }
    return false;
  }

  validateCedulaNicaragua(
    cedula: string,
    registralMunicipioNac: string,
    fechaNacimiento: string
  ) {
    //debugger;
    const primerBloqueCedula: string = cedula.substring(0, 3);
    //  this.padTextChar(
    //   registralMunicipioNac,
    //   "0",
    //   LONGITUD_PRIMER_BLOQUE,
    //   0
    // );
    if (primerBloqueCedula.length > LONGITUD_PRIMER_BLOQUE) {
      return false;
    }
    switch (this.validatePrimerBloque(cedula, primerBloqueCedula)) {
      case true:
        return this.validateLastLetterCedulaNicaragua(cedula);
        break;

      default:
        return false;
    }

  }

  private validatePrimerBloque(cedula: string, registralMunicipioNac: string) {
    //debugger;
    if (registralMunicipioNac) {
      if (
        registralMunicipioNac !== PRIMER_BLOQUE_CEDULA_EXT &&
        registralMunicipioNac !== PRIMER_BLOQUE_CEDULA_EXT
      ) {
        switch (cedula.substr(0, LONGITUD_PRIMER_BLOQUE)) {
          case registralMunicipioNac:
            return true;
          default:
            return false;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  confirmarPersona(Obj: any): Observable<any> {
    return this.http.put(this.url + '/precargado', Obj).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );;
    return null;
  }
  confirmarPaciente(): Observable<any> {
    return null;
  }

  ObtienedatosResidenciaPersona(expedienteId: number): Observable<any> {
    // this.url es igual a urlPersona: '/wspersonas-c/v3/hospitalario/personas/'
    return this.http.get(this.url + 'residencia/expediente/' + expedienteId)
      .pipe(
        retry(2),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  ActualizaResidenciaPersona(objResidencia: any): Observable<any> {
    console.info("actualizarContactoPaciente: ", objResidencia);
    return this.http.put(this.url + 'residencia', objResidencia).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  
  DescargaPdfPersona():string {
   return this.url;
  }


  private padTextChar(
    text: string,
    padChar: string,
    size: number,
    position: number
  ): string {
    switch (position) {
      case 0:
        return (String(padChar).repeat(size) + text).substr(size * -1, size);
      case 1:
        return String(text + padChar)
          .repeat(size)
          .substr(0, size);
    }
  }
}

