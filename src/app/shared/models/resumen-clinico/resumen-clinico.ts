import { DetallesResumenesClinicos } from './detalles-resumenes-clinicos';

export class ResumenClinico {
  resumenId?: number;
  solicitudId?: number;
  personalSaludId?: number;
  resumen?: string;
  detalles?: DetallesResumenesClinicos[];
  usuarioRegistro?: string;
  usuarioModificacion?: string;
}
