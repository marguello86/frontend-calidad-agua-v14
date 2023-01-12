import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuscarPersonasService {

  constructor() { }

  busquedaPersona(){
    console.log('realizamos la lógica de búsqueda de personas');
  }
}