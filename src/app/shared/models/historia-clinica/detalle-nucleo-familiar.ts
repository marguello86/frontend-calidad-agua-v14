import { Catalogos } from './catalogos';

export class DetalleNucleoFamiliar {
  detFamiliarId?: number;
  parentesco?: Catalogos;
  nivelEducacion?: Catalogos;
  aniosMayorNivel?: number;
  tipoTrabajo?: Catalogos;
  ocupacion?: string;
  anteFamiliarId?: number;
}
