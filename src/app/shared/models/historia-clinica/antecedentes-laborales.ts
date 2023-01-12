import { DetallesLaborales } from './detalles-laborales';
import { Catalogos } from './catalogos';

export class AntecedentesLaborales {
  historiaClinicaId?: number;
  historiaLaboralId?: number;
  confirmaTrabajo?: Catalogos;
  actividad?: Catalogos;
  edadInicio?: number;
  razonTrabajo?: Catalogos;
  trabajoFuera?: string;
  observaciones?: string;
  detalletrabajos?: DetallesLaborales[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
