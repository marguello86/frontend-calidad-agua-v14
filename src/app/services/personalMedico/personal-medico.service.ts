import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { map, retry, shareReplay, catchError } from 'rxjs/operators';
import { LONGITUD_PRIMER_BLOQUE, PRIMER_BLOQUE_CEDULA_EXT, ROWS_PER_PAGE_API, FIRST_PAGE_API } from 'src/app/shared/components/persona/persona.const';
import { DataPersonalMinsa, SolicitudRespuesta, DatosDeEnvio, Respuesta } from 'src/app/shared/models/minsa-personal/minsaPersonal.models';
import { environment } from 'src/environments/environment';
import { LocalStorageAdminService } from '../local-storage-admin.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalMinsaService extends LocalStorageAdminService {

  // *SE DECLARAN LAS VARIABLES A UTILIZAR
  private url: string = environment.urlMinsaPersonales;
  public respuesta:Respuesta[]=[]

  //SE INSTANCIA LOS OBJETOS PARA EL CONSUMO DE LA API
  public personaSeleccion$: BehaviorSubject<DataPersonalMinsa> = new BehaviorSubject<any>('');
  public crearPersona$: BehaviorSubject<boolean> = new BehaviorSubject<any>('');
  public criterioBuscar$: BehaviorSubject<SolicitudRespuesta> = new BehaviorSubject<SolicitudRespuesta>(null);
  public parametros: DatosDeEnvio;
  constructor(private http: HttpClient) { super(); }

  public BusquedaAvanzada(criterio: SolicitudRespuesta): Observable<any> | Observable<string> {
    let obj: any = Object.assign(
      { identificacion: criterio.datos.identificacion },
      { tipofiltro: criterio.datos.tipofiltro }
    );
    const url = `${this.url}busquedas`;
    return this.http.post(url, obj)
      .pipe(retry(5), map((response: any) => {
        if (response.data) {
        //  console.log(response.data);
          return this.EstablecerDatosRespuesta(response.data);
        }
        return response;
      }),
        shareReplay()
      );
  }

  public establecerPersonaSeleccion(persona: any): void {
    this.personaSeleccion$.next(persona);
  }
  /**
   * METODO PARA DESCOMPONER EL OBJETO QUE VIENE DE LA API
   */
  public EstablecerDatosRespuesta(datos: any): Array<any> {
    //debugger;
    let objetoRespuesta:Respuesta;
    let respuesta:Respuesta[]=[];
    //* SE INSERTA LOS INDICE DE TABLA
    datos.forEach((el, indice) => {
      //* INJECTO EL REGISTRO AL OBJETO DATOS TABLA
      objetoRespuesta.datosTabla.id = el.id;
      objetoRespuesta.datosTabla.indPublico = el.indpublico;
      objetoRespuesta.datosTabla.fechaRegistro = el.indpublico;
      objetoRespuesta.datosTabla.pasivo = el.pasivo;
      objetoRespuesta.datosTabla.usarioRegistro = el.usuarioregistro;
      //* INJECTO LOS VALORES DE PERSONA

      //* SE INSERTAN LOS DATOS EN EL ARREGLO DE TIPO INTERFAZ
      respuesta.push(objetoRespuesta);

    });
    return respuesta;
  }

  public BusquedaAvanzadaNew(filtro: any): Observable<any> {
    const url = `${this.url}busquedas`;
    return this.http.post(url, filtro).pipe(
    // retry(2),
    map ( response => {
      let getResponse:any = response;
      if(getResponse.data != null) {
        let filterResponse = getResponse.data.filter(r => r.tipopersonal.codigo === 'TIPO_PERSONAL_AS');
        let respuesta = {
          data: filterResponse.length > 0 ? filterResponse : null,
          error: filterResponse.length > 0 ? null : "No se encontraron registros",
          message: filterResponse.length > 0 ? "Se encontraron registros" : "No se encontraron registros",
          rowcount: filterResponse.length,
          status: 200
        };
        return respuesta;
      } else {
        return response
      }
    }),
    catchError((e) => {
      return throwError(e);
    })
    );
  }

}
