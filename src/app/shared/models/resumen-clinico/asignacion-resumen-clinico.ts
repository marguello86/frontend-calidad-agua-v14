import { Catalogo } from 'src/app/shared/models/catalogo/catalogo';

export class AsignacionResumenClinico {
  solicitudResumenId?: number;
  asigna?: number;
  asignadaA?: number;
  especialidad?: Catalogo;
  usuarioRegistro?: string;
  usuarioModificacion?: string;
}
