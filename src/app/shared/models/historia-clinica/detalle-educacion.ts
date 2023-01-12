import { Catalogos } from './catalogos';

export class DetalleEducacion {
  educacionId?: number;
  historiaClinicaId?: number;
  estudia?: Catalogos; 
  gradoActual?: string;
  nivelEscolaridad?: Catalogos;
  nombreCentro?: string;
  anniosAprobados?: number;
  problemasEscuela?: Catalogos;
  anniosRepetidos?: number;
  anniosRepCausa?: string;
  violenciaEscolar?: Catalogos;
  exclusion?: Catalogos;
  exclusionCausa?: string;
  educacionNoFormal?: Catalogos;
  descripcioneduNoFormal?: string;
  observaciones?: string;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}
