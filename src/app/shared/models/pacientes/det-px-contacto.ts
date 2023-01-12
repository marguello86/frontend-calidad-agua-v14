//import { ControlRegistro } from '../core/control-registro';
import { HstDivisionPolitica } from '../../models/catalogo/hst-division-politica'

export interface DetPxContacto {
  id: number;
  //controlRegistro?: ControlRegistro;
  tipoRelacionId?: number;
  tipoRelacionNombre?: string;
  pacienteId?: number;
  personaId?: number;
  personaNombre?: string;
  departamentoId?: number;
  municipioId?: number;
  comunidadId?: number;
  direccionHabitual?: string;
  telefono1?: string;
  telefono2?: string;
  divisionPolitica?: HstDivisionPolitica;
}
