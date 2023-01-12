import { Catalogos } from './catalogos';

export class AntecedentesParto {
  antePartoId?: number;
  historiaClinicaId?: number;
  lugarParto?: Catalogos;
  fechaNacimiento?: Date;
  edadGestacional?: number;
  duracionParto?: number;
  medidaDuracion?: Catalogos;
  atencionParto?: number;
  via?: Catalogos;
  presentacion?: string;
  eventualidades?: string;
  unidadSalud: Catalogos;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
