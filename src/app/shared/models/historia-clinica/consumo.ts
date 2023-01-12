import { DetalleConsumo } from './detalle-consumo';

export class Consumo {
  historiaClinicaId: number;
  consumo: DetalleConsumo[];
  estadoRegistro: number;
  usuarioRegistro: string;
  fechaRegistro: Date;
  usuarioModificacion: string;
  fechaModificacion: Date;
}
