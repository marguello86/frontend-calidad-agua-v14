import { DetalleAlimentacion } from './detalle-alimentacion';
import { Catalogos } from './catalogos';

export class AlimentacionPediatrica {
  historiaClinicaId?: number;
  alimentacion?: DetalleAlimentacion[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
