import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpHeadersService {

  constructor() { }
  //* SE ESTABLECE LA CABECERA
  ObtenerCabecera() {
    const storage: any = JSON.parse(localStorage.getItem('JWT'));
    if (storage) {
      //const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
      const header = new HttpHeaders({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'AllowCredentials': 'true',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, content-type, Accept',
        'Authorization': `Bearer ${storage}`
      })
      return header;
    }
  }
}
