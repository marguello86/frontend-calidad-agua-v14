import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CAT_H_ESTADO_PACIENTE_CRITICO, CAT_H_ESTADO_PACIENTE_ESTABLE, CAT_PRC_INGRESO_CONSLT_EXT, CAT_PRC_INGRESO_EMERGENCIA, CAT_PRC_INGRESO_REFCONTRAREF, EXPEDIENTE, PRIMARY_KEY, SCHEMA_CONSULTA_EXTERNA, SCHEMA_EMERGENCIA, SCHEMA_HOSPITALIZACION, UNIDAD_SALUD } from 'src/app/shared/app.const';
import { environment } from 'src/environments/environment';
import { LocalStorageAdminService } from './local-storage-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdmisionService extends LocalStorageAdminService {

  private schemaRequest: string = SCHEMA_HOSPITALIZACION;
  private urlMainController: string = '';
  //private urlIngresosController: string = `${environment.urlHospitalizacionIngresosEgresos}preingresos/`
  private urlEmergenciaController: string = `${environment.urlEmergencia}consulta/obtenerDatosConsultaEmergencia/`
  //private urlConsultaExternaController: string = `${environment.urlConsultaExterna}consulta/obtenerDatosConsultaconsultaexterna/`

  private mockData = of({
    error: null,
    message: null,
    data: [{
      select: false,
      id: 1,
      persona: { id: 3099160, nominalId: 7973295 },
      expedienteId: 7973295,
      identificacion: '0012504890034B',
      nombreCompleto: 'ARICK ANTONIO ROQUE CANELO', //cambiar Por nombreCompleto
      admision: { id: 588 },
      tipo: { id: 1206, codigo: CAT_PRC_INGRESO_EMERGENCIA },
      fechaSolicitud: new Date(),
      estado: {
        id: 0,
        codigo: CAT_H_ESTADO_PACIENTE_ESTABLE,
        valor: 'ESTABLE'
      },
      medicoSolicita: { id: 32511 },
      admisionistaSolicita: { id: 32511 },
      unidadSalud: {
        id: 22
      }
    },
    {
      select: false,
      id: 36,
      persona: { id: 2743116, nominalId: 4999992 },
      expedienteId: 4192295,
      identificacion: '2011204830005C',
      nombreCompleto: 'JORGE ISAAK MAIRENA ALEMAN',
      admision: { id: 588 },
      tipo: { id: 1206, codigo: CAT_PRC_INGRESO_EMERGENCIA },
      fechaSolicitud: new Date(),
      estado: {
        id: 0,
        codigo: CAT_H_ESTADO_PACIENTE_ESTABLE,
        valor: 'ESTABLE'
      },
      unidadSalud: {
        id: 22
      }
    },
    {
      select: false,
      id: 3,
      persona: { id: 2685722, nominalId: 7197446 },
      expedienteId: 217434,
      identificacion: '0011209700073B',
      nombreCompleto: 'ETHELVINA DE LOS ANGELES LUNA MURILLO',
      admision: { id: 588 },
      tipo: { id: 1206, codigo: CAT_PRC_INGRESO_CONSLT_EXT },
      fechaSolicitud: new Date(),
      estado: {
        id: 0,
        codigo: CAT_H_ESTADO_PACIENTE_CRITICO,
        valor: 'CRITICO'
      },
      unidadSalud: {
        id: 22
      }
    },
    {
      select: false,
      id: 4,
      persona: { id: 2372704, nominalId: 9124756 },
      expedienteId: 4666878,
      identificacion: '0011011820017J',
      nombreCompleto: 'DAVID SALOMON LOAISIGA MORALES',
      admision: { id: 588 },
      tipo: { id: 1206, codigo: CAT_PRC_INGRESO_CONSLT_EXT },
      fechaSolicitud: new Date(),
      estado: {
        id: 0,
        codigo: CAT_H_ESTADO_PACIENTE_ESTABLE,
        valor: 'ESTABLE'
      },
      unidadSalud: {
        id: 22
      }
    },
    {
      select: false,
      id: 5,
      persona: { id: 1096246, nominalId: 5710359 },
      expedienteId: 21773,
      identificacion: '0012306740001F',
      nombreCompleto: 'ALBERTO ANTONIO EMES GARCIA',
      admision: { id: 588 },
      tipo: { id: 1206, codigo: CAT_PRC_INGRESO_CONSLT_EXT },
      fechaSolicitud: new Date(),
      estado: {
        id: 0,
        codigo: CAT_H_ESTADO_PACIENTE_ESTABLE,
        valor: 'ESTABLE'
      },
      unidadSalud: {
        id: 22
      }
    },
    {
      select: false,
      id: 6,
      persona: { id: 2575791, nominalId: 8709047 },
      expedienteId: 22022,
      identificacion: '5610709810004U',
      nombreCompleto: 'FREDDY FRANCISCO SEQUEIRA ORTEGA',
      admision: { id: 588 },
      tipo: { id: 1206, codigo: CAT_PRC_INGRESO_REFCONTRAREF },
      fechaSolicitud: new Date(),
      estado: {
        id: 0,
        codigo: CAT_H_ESTADO_PACIENTE_CRITICO,
        valor: 'CRITICO'
      },
      unidadSalud: {
        id: 22
      }
    }
    ]
  });

  constructor(private http: HttpClient) { super(); }

  public mainLookUp(typeParameter: string, ...id: number[]): Observable<any> {
    switch (typeParameter) {
      case PRIMARY_KEY:
        return this.getById(id[0]);
      case EXPEDIENTE:
        return this.getByExpedienteId(id[0]);
      case UNIDAD_SALUD:
        return this.getByUnidadSaludDestId(id[0]);

      default:
        return this.getAll();
    }

  }

  //public mainLookUp(typeParameter: string, ...id: number[]): Observable<any> {
  public mainLookUpAdvanced(typeAdmision: string, typeParameter: string, data: any, ...id: number[]): Observable<any> {
    this.schemaRequest = typeAdmision;
    switch (typeParameter) {
      case PRIMARY_KEY:
        return this.getById(id[0]);
      case EXPEDIENTE:
        return this.getByExpedienteId(id[0]);
      case UNIDAD_SALUD:
        return this.getByUnidadSaludDestId(id[0]);

      default:
        return this.getAll();
    }

  }

  public mainLookUpAdvancedObj(data: any): Observable<any> {
    return;
    //return this.http.post(`${this.urlIngresosController}search`, data, { observe: 'response', reportProgress: true, responseType: 'json' });
  }

  public getById(id: number): Observable<any> {
    // return this.mockData.pipe(filter(v => v.id === id), delay(1000));
    const entity: { id: number } = { id: id };
    switch (this.schemaRequest) {
    //case SCHEMA_HOSPITALIZACION:
        // return this.http.post(`${this.urlIngresosController}search`, { datos: { id } }, { observe: 'response', reportProgress: true, responseType: 'json' });
        //return this.http.post(`${this.urlIngresosController}search`, { datos: { entity } }, { observe: 'response', reportProgress: true, responseType: 'json' });

      case SCHEMA_EMERGENCIA:
        return this.http.get(`${this.urlEmergenciaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

        //case SCHEMA_CONSULTA_EXTERNA:
        //return this.http.get(`${this.urlConsultaExternaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

      default:

        break;
    }


    // return this.mockData.pipe(delay(1000));
  }

  private getByExpedienteId(id: number): Observable<any> {
    /* switch (this.schemaRequest) {
       case SCHEMA_HOSPITALIZACION:
         return this.http.post(`${this.urlIngresosController}search`, { datos: { id } }, { observe: 'response', reportProgress: true, responseType: 'json' });

       case SCHEMA_EMERGENCIA:
         return this.http.get(`${this.urlEmergenciaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

       case SCHEMA_CONSULTA_EXTERNA:
         return this.http.get(`${this.urlConsultaExternaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

       default:

         break;
     }*/
    return this.mockData.pipe(delay(1000));
  }

  private getByUnidadSaludDestId(id: number): Observable<any> {
    /* switch (this.schemaRequest) {
      case SCHEMA_HOSPITALIZACION:
        return this.http.post(`${this.urlIngresosController}search`, { datos: { id } }, { observe: 'response', reportProgress: true, responseType: 'json' });

      case SCHEMA_EMERGENCIA:
        return this.http.get(`${this.urlEmergenciaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

      case SCHEMA_CONSULTA_EXTERNA:
        return this.http.get(`${this.urlConsultaExternaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

      default:

        break;
    } */
    return this.mockData.pipe(delay(1000));
  }

  private getAll(): Observable<any> {
    /* switch (this.schemaRequest) {
      case SCHEMA_HOSPITALIZACION:
        return this.http.post(`${this.urlIngresosController}search`, { datos: { id } }, { observe: 'response', reportProgress: true, responseType: 'json' });

      case SCHEMA_EMERGENCIA:
        return this.http.get(`${this.urlEmergenciaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

      case SCHEMA_CONSULTA_EXTERNA:
        return this.http.get(`${this.urlConsultaExternaController}${id}/0`, { observe: 'response', reportProgress: true, responseType: 'json' });

      default:

        break;
    } */
    return this.mockData.pipe(delay(1000));
  }

  public save(data: any): Observable<any> {
    if (!data) { return; }
    if (data.id < 1) {
      return;
    //return this.http.post(this.urlIngresosController, { datos: data }, { observe: 'response', reportProgress: true, responseType: 'json' });
    } else {
    return;
    //return this.http.put(this.urlIngresosController, { datos: data }, { observe: 'response', reportProgress: true, responseType: 'json' });
    }
  }


}
