import { Catalogos } from './catalogos';

export class Habitos {
  habitosId?: number;
  historiaClinicaId?: number;
  inmunizacionCompleta?: Catalogos;
  descripcioninmunizacion?: string;
  suenoNormal?: Catalogos;
  horasSueno?: number;
  alimentacionAdecuada?: Catalogos;
  comidasDia?: number;
  comidasDiaFamilia?: number;
  conduceVehiculo?: Catalogos;
  descripcionVehiculo?: string;
  seguridadVial?: Catalogos;
  tipoActividadFisica?: Catalogos;
  horasActividad?: number;
  horasTv?: number;
  horasJuegosVirtuales?: number;
  otrosHabitos?: string;
  otrosActividades?: string;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
