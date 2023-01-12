import { HistoriaClinica } from 'src/app/shared/models/historia-clinica/historia-clinica';
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmitirHistoriaClinicaService {
@Output() emitirData: EventEmitter<HistoriaClinica> = new EventEmitter<HistoriaClinica>();
  constructor() { }
}
