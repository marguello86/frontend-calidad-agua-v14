// import { ControlRegistro } from '../core/control-registro';
// import { ControlHechos } from '../core/control-hechos';
import { Persona } from '../../models/persona/persona.models';

export interface MstPaciente {
  id: number;
  precargado?: boolean;
  //controlRegistro?: ControlRegistro;

  codigoExpediente?: string;
  codigoExpedienteObsoleto?: boolean;
  codigoExpedienteLocal?: string;
  personaId?: number;
  personaIdentificada?: boolean;

  tipoExpedienteId?: number;
  tipoExpedienteNombre?: string;
  tipoPacienteId?: number;
  tipoPacienteNombre?: string;
  indDesconocido?: boolean;
  nombreCompleto?: string;

  tipoSangreId?: number;
  tipoSangreNombre?: string;
  etniaId?: number;
  etniaNombre?: string;
  religionId?: number;
  religionNombre?: string;
  persona?: Persona;

 // controlHechos?: ControlHechos;
}
