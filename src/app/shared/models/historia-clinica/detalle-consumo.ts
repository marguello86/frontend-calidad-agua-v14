import { Catalogos } from './catalogos';

export class DetalleConsumo {
  consumoId?: number;
  tipoConsumo?: Catalogos;
  subTipoConsumo?: Catalogos;
  frecuencia?: Catalogos;
  edadInicioAnnios?: number;
  edadInicioMeses?: number;
  edadAbandono?: number;
  repercusiones?: Catalogos;
  duracion?: number;
  episodiosAbuso?: Catalogos;
  observaciones?: string;
  confirmaConsumo?: Catalogos;
  estadoRegistro?: number;
  usuarioRegistro?: string;
  fechaRegistro?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
