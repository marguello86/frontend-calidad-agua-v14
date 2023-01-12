import { Catalogos } from './catalogos';
import { Persona } from './../persona/persona.models';
import { MinsaPersonal } from './../minsa-personal/minsaPersonal.models';
import { Codigoexpediente } from 'src/app/shared/models/persona/datos-clinicos';
import { Entidadesadtvas } from '../catalogo/catalogo-unidad';
export class HistoriaClinica {
  historiaClinicaId?: number;
  admisionServicio?: Catalogos;
  tipoHistoria?: Catalogos;
  expediente?: Codigoexpediente;
  entidad?: Entidadesadtvas;
  paciente?: Persona;
  personalSalud?: MinsaPersonal;
  estadoRegistro?: Catalogos;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
  fechaHistoria?: Date;
  edad?: string;
}
