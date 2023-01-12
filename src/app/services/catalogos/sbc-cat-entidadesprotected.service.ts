import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { ApiRespuesta } from 'src/app/shared/models/rest-api/api-respuesta';
import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SbcCatEntidadesprotectedService implements OnDestroy {
  protected endpoint: string = environment.urlSeguridad;
  private silais$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private unidades$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private _unidadesPermitidas: any[];

  constructor(protected http: HttpClient) { }

  obtenerSilais(entidad: string): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + entidad /*, RestApiUtils.httpGetOptions */)
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }
  obtenerPorReferenciaId(entidad: string, referencia?: string, id?: number): Observable<ApiRespuesta<Catalogo>> {
    return this.http.get<ApiRespuesta<Catalogo>>(
      this.endpoint + entidad /*+ referencia + */ + '/' + (id ? id : ''))
      .pipe(map((res: ApiRespuesta<Catalogo>, index?: number) => {
        const body = (res || null);
        return body;
      }));
  }
  obtenerUnidadesUser(url: string): Observable<any> {
    return this.http.get(`${this.endpoint}${url}`)
    .pipe(
      retry(2),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  verificarPermisos(seguimientoSelected: any): boolean {
    if (!this.verificarNA(seguimientoSelected)) {
       return true;
    }
    let unidad: any;
    this._unidadesPermitidas.find(un => {
      const unidades: any [] = un.unidades;
      if (unidades.length > 0) {
           unidad = unidades.find(unid => {
           if (unid.id === seguimientoSelected.relunidadseguimiento[0].
           entidadseguimiento.unidad.id) {
            return unid;
           }
         });
      }
      return unidad;
    });
    return unidad ? true : false;
  }
  verificarNA(seguimientoSelected: any): boolean {
    if (seguimientoSelected) {
      return seguimientoSelected.relunidadseguimiento[0].entidadseguimiento.id > 0 &&
      seguimientoSelected.relunidadseguimiento[0].entidadseguimiento.unidad.id > 0;
    }
  }
  get unidadesPermitidas(): any[] {
    return this._unidadesPermitidas;
  }
  set unidadesPermitidas(value: any[]) {
    if (value) {
      this._unidadesPermitidas = value;
    }
  }

  public sendSilais(silais: any) {
    this.silais$.next(silais);
  }
  public sendUnidades(unidades: any) {
    this.unidades$.next(unidades);
  }
  getSilais(): Observable<any> {
    return this.silais$.asObservable();
  }
  clearSilais(): void {
    this.silais$.next(null);
  }
  getUnidades(): Observable<any> {
    return this.unidades$.asObservable();
  }
  clearUnidades(): void {
    this.unidades$.next(null);
  }
  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }
}
