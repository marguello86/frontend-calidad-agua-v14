import { DetalleCirugias } from './detalle-cirugias';

export class Cirugias {
  historiaClinicaId?: number;
  historiascirugias?: DetalleCirugias[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
