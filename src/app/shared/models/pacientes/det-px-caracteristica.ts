//import { ControlRegistro } from '../core/control-registro';

export interface DetPxCaracteristica {
  id: number;
  //controlRegistro?: ControlRegistro;

  pacienteId?: number;
  caracteristicaId?: number;
  caracteristicaNombre?: string;
  valor?: string;
}
