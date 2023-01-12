import { Catalogo } from "../catalogo/catalogo";
import { CatalogMinime } from "../persona/persona.models";

export interface DatosClinicos {
  status: number;
  error?: any;
  message: string;
  data: InfoDatosClinicos[];
}

export interface InfoDatosClinicos {
  id: number;
  tipodato: Tipodato;
  valormedicion?: string;
  momentomedicion: Tipodato;
  fecharegistro: string;
  general?: General;
  minsapersonal: any;
  fechatoma: string;
}

interface General {
  respiratoria?: Tipodato;
  cardiaca?: Tipodato;
  oxigenacion?: Tipodato;
  diastolica?: Tipodato;
  sistolica?: Tipodato;
  altura?: Tipodato;
  peso?: Tipodato;
  temperatura?: Tipodato;
  ocular?: Tipodato;
  verbal?: Tipodato;
  motora?: Tipodato;
  total?: Tipodato;
  imc?: Tipodato;
  glucosa?: Tipodato;
}

interface Tipodato {
  id?: number;
  codigo?: string;
  valor?: string;
  descripcion?: string;
  pasivo?: boolean;
}
export interface Tipo {
  id: number;
  codigo?: string;
  valor?: string;
  descripcion?: string;
  pasivo: boolean;
}
export interface Dependencia {
  id: number;
  nombre?: string;
  codigo?: string;
  correo?: string;
  tipo: Tipo;
  telefono?: string;
  indpublico: number;
  pasivo: boolean;
}
export interface MinsaPersonal {
  id?: number;
  indPublico?: string;
  pasivo?: boolean;
  usarioRegistro?: string;
  fechaRegistro?: string
  tipopersonal?: Catalogo;
}
export interface Unidad {
  codigo?: string;
  id: number;
  nombre?: string;
  pasivo?: boolean;
}
export interface Listadatosclinico {
  id?: number;
  fechatoma?: string;
  tipodato?: CatalogMinime;
  valormedicion?: string;
  momentomedicion?: CatalogMinime;
  valorrelacional?: number;
}
export interface Admisionservicio {
  id?: number;
  servicio?: Servicio; //
  codigo?: string;
  minsapersonal?: MinsaPersonal;
  dependencia?: Dependencia;
  pasivo?: boolean;
  usuarioregistro?: string;
  fecharegistro?: Date;
  usuariomodificacion?: string;
  fechamodificacion?: Date;
  listadatosclinicos?: Listadatosclinico[]; //esto se llena en triage
  unidadsalud?: Unidad;
}
export interface Especialidad {
  id: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  pasivo: boolean;
}
export interface Servicio {
  id?: number;
  codigo?: string;
  especialidad?: Especialidad;
  nombre?: string;
  descripcion?: string;
  pasivo?: boolean;
}
