//import { ControlRegistro } from '../core/control-registro';
import { HstDivisionPolitica } from '../catalogo/hst-division-politica';

export interface DetPxResidencia {
  id: number;
  //controlRegistro?: ControlRegistro;

  tipoResidenciaId?: number;
  tipoResidenciaNombre?: string;
  pacienteId?: number;
  departamentoId?: number;
  municipioId?: number;
  comunidadId?: number;
  direccionHabitual?: string;
  telefono1?: string;
  telefono2?: string;

  divisionPolitica?: HstDivisionPolitica;
}
