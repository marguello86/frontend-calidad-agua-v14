import { DetalleFamiliaConvive } from './detalle-familia-convive';
import { DetalleNucleoFamiliar } from './detalle-nucleo-familiar';
import { Catalogos } from './catalogos';

export class NucleoFamiliar {
  historiaClinicaId?: number;
  antFamiliarId?: number;
  vive?: Catalogos;
  percepcionFamiliar?: Catalogos;
  observaciones?: string;
  detallefamilia?: DetalleNucleoFamiliar[];
  familiaconvive?: DetalleFamiliaConvive[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
