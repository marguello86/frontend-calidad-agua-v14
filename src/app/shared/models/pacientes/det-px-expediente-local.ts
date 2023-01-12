//import { ControlRegistro } from '../core/control-registro';

export interface DetPxExpedienteLocal {
  id: number;
  //controlRegistro?: ControlRegistro;

  pacienteId?: number;
  unidadSaludId?: number;
  unidadSaludNombre?: string;
  expedienteLocal?: string;
  fechaCreacion?: Date;
}
