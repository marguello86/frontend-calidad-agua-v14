import { DetalleEnfermedades } from './detalle-enfermedades';

export class AntecedentesPatologicosFamiliares {
  historiaClinicaId?: number;
  enfermedades?: DetalleEnfermedades[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
