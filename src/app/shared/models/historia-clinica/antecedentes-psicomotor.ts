import { Catalogo } from '../catalogo/catalogo';
import { DetalleAntecedentePsicomotor } from './detalle-antecedente-psicomotor';

export class AntecedentesPsicomotor {
  historiaClinicaId?: number;
  desarrollo?: DetalleAntecedentePsicomotor[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
