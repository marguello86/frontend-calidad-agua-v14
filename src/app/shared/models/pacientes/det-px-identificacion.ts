//import { ControlRegistro } from '../core/control-registro';

export interface DetPxIdentificacion {
  id: number;
  //controlRegistro?: ControlRegistro;

  pacienteId?: number;
  tipoIdentificacionId?: number;
  tipoIdentificacionNombre?: string;
  identificacion?: string;
}
