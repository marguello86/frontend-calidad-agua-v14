import { ControlRegistro } from '../core/control-registro';

export interface Entidad {
  id: number;
  codigo?: string;
  nombre?: string
  descripcion?: string;
  controlRegistro?: ControlRegistro;
}
export interface Entidad1 {
  id: number;
  codigo?: string;
 // nombre?: string
  valor?: string;
  descripcion?: string;
  controlRegistro?: ControlRegistro;
  childrens: Entidad1[];
}
