import { AntecedentesObstetricos } from './antecedentes-obstetricos';
import { AntecedentesUrologicos } from './antecedentes-urologicos';

export class AntecedentesGinecoUrologico {
  historiaClinicaId?: number;
  antobstetricos?: AntecedentesObstetricos;
  ginecourologico?: AntecedentesUrologicos;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
