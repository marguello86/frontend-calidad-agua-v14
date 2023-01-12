import { DetalleExamenesFisicos } from './detalle-examenes-fisicos';
export class CategoriaExamenesFisicos {
  examenFisicoId?: number;
  historiaClinicaId?: number;
  examenesfisicos?: DetalleExamenesFisicos[];
  usuarioRegistro?: string;
  usuarioModificacion?: string;
  fechaRegistro?: Date;
}
