import { DetalleExamenesFisicos } from './detalle-examenes-fisicos';
export class ExamenesFisicos {
  examenFisicoId?: number;
  examenes?: DetalleExamenesFisicos[];
  historiaClinicaId?: number;
  perimetroCefalico?: number;
  perimetroToracico?: number;
  perimetroAbdominal?: number;
  superficieCorporal?: number;
  peso?: number;
  talla?: number;
  imc?: number;
  examenNeurologico?: string;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
