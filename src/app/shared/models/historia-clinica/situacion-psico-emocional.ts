import { DetallePsicoEmocional } from './detalle-psico-emocional';
import { Catalogos } from './catalogos';

export class SituacionPsicoEmocional {
  historiaClinicaId?: number;
  psicoEmocionalId?: number;
  proyectoVida?: Catalogos;
  apoyoRedes?: Catalogos;
  telefonoAdulto?: number;
  celAdulto?: number;
  observaciones?: string;
  detallepsicoemocional?: DetallePsicoEmocional[];
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
