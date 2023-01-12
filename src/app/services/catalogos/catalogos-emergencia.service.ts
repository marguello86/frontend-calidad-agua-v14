import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import {Observable} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { Children } from 'src/app/services/catalogo/catalogo-emergencia-area';
import { DatosCIE } from 'src/app/shared/models/catalogo/catalogo-cie';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { environment } from 'src/environments/environment';
import { RestApiUtils } from '../rest-api/rest-api-utils';

@Injectable({
  providedIn: 'root'
})
export class CatalogosEmergenciaService {
  protected endpoint: string = environment.urlWsCatalogosMinsa;
  protected acceso: string = environment.urlWsHospitalario;
  protected emergencia: string = environment.urlEmergencia;

  constructor(protected http: HttpClient) { }

  obtenerPorCodigo(valor: string, tipo: number): Observable<Catalogo> {
    return this.http.get(this.endpoint + 'gestion-catalogos/catalogos/codigo/' + valor + '/' + tipo).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }
  obtenerPorValor(valor: string): Observable<Catalogo> {
    return this.http.get(this.endpoint + 'gestion-catalogos/catalogos/valor/' + valor).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  obtieneServiciosPorUnidadSalud(unidadId: number, especialidadCodigo: string): Observable<any>{    
    return this.http.get(this.acceso + 'listaserviciosunidad/' + unidadId + '/' + especialidadCodigo).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  ObtenerCatalogoArea(valor: string, tipo: number): Observable<ApiRespuesta<Children>> {
    var ApiRespuesta: Catalogo;
    //console.log('que es ApiRespuesta<Catalogo>:', ApiRespuesta);

    return this.http.get<ApiRespuesta<Catalogo>>(
      this.acceso + 'gestion-catalogos/catalogos/codigo/' + valor + '/' + tipo, RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        //debugger;
        const body = (res || null);
        return body;
      }));
  }

  ObtenerCatalogoComun(valor: string, tipo: number): Observable<ApiRespuesta<Children>> {
    var ApiRespuesta: Catalogo;
    //console.log('que es ApiRespuesta<Catalogo>:', ApiRespuesta);

    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + 'gestion-catalogos/catalogos/codigo/' + valor + '/' + tipo, RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        //debugger;
        const body = (res || null);
        return body;
      }));
  }

  //OBTENER CATALOGO CIE
  ObtenerCatalogoCIE(eno:number,enoespacial:number,descripcion:string): Observable<ApiRespuesta<DatosCIE>> {
    //http://desa.minsa.gob.ni/wsemergencia/v1/emergencia/gestion/cie/0/0
    return this.http.get<ApiRespuesta<DatosCIE>>(
      `${this.emergencia}cie/${eno}/${enoespacial}/${descripcion}`,RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<DatosCIE>) => {
        //debugger;
        const body = (res || null);
        //console.log('cie',JSON.stringify(body));
        return body;
      }));
  }

  BuscarDiagnosticoCIE(valorBuscado:string){
    //http://desa.minsa.gob.ni/wshospitalariominsa/v2/hospitalario/catcie10/${busqueda}
    return this.http.get<ApiRespuesta<DatosCIE>>(
      `${this.acceso}catcie10/${valorBuscado}`,RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<DatosCIE>) => {
        //debugger;
        const body = (res || null);
        //console.log('cie',JSON.stringify(body));
        return body;
      }));
  }

  ObtenerCatalogoEstado(valorBusqueda:string, tipobusqueda:number): Observable<ApiRespuesta<Children>> {
    //http://desa.minsa.gob.ni/wscatalogosminsa/v2/catalogos/gestion-catalogos/catalogos/codigo/ESTADOPACIENTE/1
    return this.http.get<ApiRespuesta<Children>>(
      `${this.endpoint}gestion-catalogos/catalogos/codigo/${valorBusqueda}/${tipobusqueda}`,RestApiUtils.httpGetOptions)
      .pipe(map((res: ApiRespuesta<DatosCIE>) => {
        //debugger;
        const body = (res || null);
        //console.log('cie',JSON.stringify(body));
        return body;
      }));

  }

  obtieneTieneTipoIngreso(valor?:any, jerarquico?:any): Observable<any>
  {

  return null;
  }

  obtenerCatalogoComun(codigo) {   

    this.obtenerPorCodigo(codigo,1).subscribe({
      next:(respuesta:any) => {
        if (respuesta.error) { 
          return respuesta.error;
        }
        if(!respuesta.data[0]){
           return respuesta.message;
        }
        else {
          return respuesta.data[0].childrens[0];  
        }
      },
      error: (err:any) => {       
        return err;
      },
      complete:() => {
        //console.log('se termina el método de obtener catalogo');        
      }
    }
    );    
  }

}
