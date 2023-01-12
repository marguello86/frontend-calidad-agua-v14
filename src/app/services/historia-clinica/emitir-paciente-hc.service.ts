import { EventEmitter, Injectable, Output } from '@angular/core';
import { Persona } from 'src/app/shared/models/persona/persona.models';

@Injectable({
  providedIn: 'root',
})
export class EmitirPacienteHcService {
  @Output() paciente_emitido: EventEmitter<Persona> = new EventEmitter();

  constructor() {}
}
