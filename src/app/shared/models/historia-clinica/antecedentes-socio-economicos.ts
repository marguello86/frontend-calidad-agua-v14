import { CatalogosEspecifico } from './catalogos-especifico';
import { Catalogos } from './catalogos';

export class AntecedentesSocioEconomicos {
  anteSocioEconomicoId?: number;
  historiaClinicaId?: number;
  casa?: Catalogos;
  detalle?: CatalogosEspecifico[];
  habitaciones?: number;
  lugarAgua?: Catalogos;
  lugarExcretas?: Catalogos;
  numeroPersonas?: number;
  telefono?: number;
  observaciones?: string;
  otros?: string;
  hacimiento?: number;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
