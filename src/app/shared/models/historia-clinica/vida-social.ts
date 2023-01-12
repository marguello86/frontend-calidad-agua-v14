import { Catalogos } from './catalogos';

export class VidaSocial {
  vidaSocialId?: number;
  historiaClinicaId?: number;
  aceptacion?: Catalogos;
  pareja?: Catalogos;
  edadParejaAnnios?: number;
  edadParejaMeses?: number;
  violenciaPareja?: Catalogos;
  amigos?: Catalogos;
  confirmaActividades?: Catalogos;
  otrasActividades?: string;
  observaciones?: string;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}
