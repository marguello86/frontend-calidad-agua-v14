import { HistoriaClinica } from './historia-clinica';
export class DetalleHistoriaClinica {
  detHistoriaClinicaId?: number;
  historiaClinicaId?: number;
  observaciones?: string;
  diagnostico?: string;
  interconsultas?: string;
  motivoConsulta?: string;
  historialEnfermedades?: string;
  interrogatorio?: string;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
