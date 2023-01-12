import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError,map,shareReplay } from 'rxjs/operators';
import { InfoDatosClinicos } from 'src/app/shared/models/dato-clinico/dato-clinicos';
import { DatosClinicosPorFecha } from 'src/app/shared/models/dato-clinico/datos-clinicos-por-fecha';
import { environment } from 'src/environments/environment';
import { RestApiClient } from '../rest-api/rest-api-client';

@Injectable({
  providedIn: 'root'
})
export class DatosClinicosService extends RestApiClient<any> {
  private datosClinicos: DatosClinicosPorFecha;
  protected endpoint: string = environment.urlEmergencia;

  constructor(http: HttpClient,
    //private datepipe: DatePipe
  ) {
    super(http);
  }

  //aun no esta creado el endpoint
  obtenerDatosClinicos(idAdmisionServicio: string,momentoDato:string): Observable<any> {
   //MTDTCLINICO01
    return this.http.get(this.endpoint + "DatosClinicos/" + idAdmisionServicio + "/0/"+momentoDato).pipe(
      retry(2),
      catchError((e) => {
        return throwError(() => e);
      })
    );
  }

/*  obtenerDatosClinicosXmomento(idAdmisionServicio: string,momentoDato:string): Observable<any> {
    //MTDTCLINICO01
     return this.http.get(this.endpoint + "DatosClinicos/" + idAdmisionServicio + "/0/"+ momentoDato).pipe(
       retry(2),
       catchError((e) => {
         return throwError(e);
       })
     );
   }
 
*/
  //Listo
  crearDatosClinicos(objDatosClinicos: any): Observable<any> {
    
    return this.http.post(this.endpoint + "DatosClinicos", objDatosClinicos).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }


  //aun no esta creado el endpoint
  actualizarDatosClinicos(objDatosClinicos: any): Observable<any> {
    
    return this.http.put(this.endpoint + "DatosClinicos", objDatosClinicos).pipe(
      retry(2),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  ObtenerDatosClinicosXAdmisionId(objDatosClinicos: any): Observable<any> {  
    return this.http.post(this.endpoint + "DatosClinicos/filtros", objDatosClinicos)
    .pipe(retry(2),map((response)=>{return response;}),  
           catchError((e) => { return throwError(e);}),
           shareReplay()      
    );
  }

  ObtenerDatosclinicosPorFecha(data: InfoDatosClinicos[]): DatosClinicosPorFecha[] {
    
    let arrayDatosClinico: DatosClinicosPorFecha[] = [];
    const arrayFecha = Array.from(new Set(data.map(s => s.fechatoma))).map(el => { return { fecharegistro: el }; });
  //  console.log(arrayFecha);
    //console.log('Datos Clinicos', data);
    arrayFecha.forEach((d) => {

      this.datosClinicos = {
        fecharegistro: null,
        minsapersonal:null,
        general: {
          respiratoria: {},
          cardiaca: {},
          oxigenacion: {},
          diastolica: {},
          sistolica: {},
          altura: {},
          peso: {},
          glucosa:{},
          temperatura: {},
          ocular: {},
          verbal: {},
          motora: {},
          total: {},
          imc: {}
        }
      };

      this.datosClinicos.fecharegistro = d.fecharegistro;
      data.forEach((e) => {
      //  debugger;
        if (d.fecharegistro === e.fechatoma) {
          if(this.datosClinicos.minsapersonal===null)
             this.datosClinicos.minsapersonal=e.minsapersonal.persona.nombrecompleto;
          
       //   debugger;
          switch (e.tipodato.codigo) {
            case 'DTCLINICO01':
              this.datosClinicos.general.sistolica={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO02':
              this.datosClinicos.general.cardiaca={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO03':
              this.datosClinicos.general.respiratoria={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO04':
              this.datosClinicos.general.temperatura={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO11':
              this.datosClinicos.general.peso={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO13':
              this.datosClinicos.general.altura={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO14':
              this.datosClinicos.general.diastolica={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO15':
              this.datosClinicos.general.oxigenacion={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
            case 'DTCLINICO16':
                this.datosClinicos.general.glucosa={
                  id: e.id,
                  codigo: e.tipodato.codigo,
                  valor: e.valormedicion
                };
                break;  
            case 'IMC':
              this.datosClinicos.general.imc={
                id: e.id,
                codigo: e.tipodato.codigo,
                valor: e.valormedicion
              };
              break;
          }
        }
      });
      arrayDatosClinico.push( Object.assign({} , this.datosClinicos) );
    });
    //console.log('data',JSON.stringify(arrayDatosClinico));
    return arrayDatosClinico.sort((a, b) => a.fecharegistro < b.fecharegistro ? 1 : -1); 
  }


}