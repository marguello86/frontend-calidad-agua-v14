import { Catalogos } from './catalogos';

export class DetallesLaborales {
  detHistLaboralId?: number;
  ocupacion?: Catalogos;
  lugarTrabajo?: string;
  areaTrabajo?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoTrabajo?: string;
  horasSemana?: number;
  horasDia?: number;
  horario?: Catalogos;
  horasExtras?: number;
  trabajoActual?: Catalogos;
  trabajoInfantil?: Catalogos;
  trabajoJuvenil?: Catalogos;
  trabajolegalizado?: Catalogos;
  trabajoInsalubre?: Catalogos;
  frecuenciaTarea?: string;
  exposicion?: Catalogos;
  exposicionDescripcion?: string;
  posicion?: string;
  observaciones?: string;
}
