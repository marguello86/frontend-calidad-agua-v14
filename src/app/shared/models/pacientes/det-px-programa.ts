//import { ControlRegistro } from '../core/control-registro';

export interface DetPxPrograma {
  id: number;
  //controlRegistro?: ControlRegistro;

  pacienteId?: number;
  programaId?: number;
  programaNombre?: string;
  unidadSaludId?: number;
  unidadSaludNombre?: string;
  fechaIni?: string;
  fechaFin?: Date;

  estadoId?: number;
  estadoNombre?: string;
}
