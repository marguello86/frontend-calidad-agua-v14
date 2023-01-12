//import { ControlRegistro } from '../core/control-registro';

export interface DetPxFinanciamiento {
  id: number;
  //controlRegistro?: ControlRegistro;

  pacienteId?: number;
  fuenteId?: number;
  fuenteNombre?: string;
  codigoAfiliacion?: string;
}
