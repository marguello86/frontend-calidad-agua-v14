import { DetalleAntecedentesPatologicos } from './detalle-antecedentes-patologicos';
export class AntecedentesPatologicos {
  antePatologicosId?: number;
  historiaClinicaId?: number;
  otros?: string;
  detalle?: DetalleAntecedentesPatologicos[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
