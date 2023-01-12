import { Catalogos } from '../historia-clinica/catalogos';

export class EntregaResumenClinico {
  entregaId?: number;
  solicitudId?: number;
  personaEntregaId?: number;
  fechaEntrega?: Date;
  parentesco?: Catalogos;
  observaciones?: string;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  usuarioModificacion?: string;
  fechaRegistro?: Date;
}
