interface RootObject {
  id: number;
  servicio: Servicio;
  codigo: string;
  minsapersonal: Minsapersonal;
  dependencia: Dependencia;
  pasivo: boolean;
  usuarioregistro: string;
  fecharegistro: string;
  usuariomodificacion: string;
  fechamodificacion: string;
  listadatosclinicos: Listadatosclinico[];
  unidadsalud: Unidadsalud;
}

interface Unidadsalud {
  codigo: string;
  id: number;
  nombre: string;
  pasivo: boolean;
  silais: Silais;
}

interface Silais {
  codigo: string;
  id: number;
  nombre: string;
  pasivo: boolean;
}

interface Listadatosclinico {
  id: number;
  tipodato: Tipopersonal;
  valormedicion: string;
  momentomedicion: Tipopersonal;
  fecharegistro: string;
  fechamodificacion: string;
  pasivo: boolean;
}

interface Dependencia {
  id: number;
  nombre: string;
  codigo: string;
  correo: string;
  tipo: Tipopersonal;
  telefono: string;
  indpublico: number;
  pasivo: boolean;
}

interface Minsapersonal {
  id: number;
  codigo: string;
  persona: Persona;
  tipopersonal: Tipopersonal;
  correo: string;
  telefono: string;
  indpublico: boolean;
  pasivo: boolean;
}

interface Tipopersonal {
  id: number;
  codigo: string;
  valor: string;
  descripcion: string;
  pasivo: boolean;
}

interface Persona {
  id: number;
  identificacion: string;
  nombrecompleto: string;
  direcciondomicilio: string;
  telefono: string;
  sexo: string;
  edad: string;
  fallecido: boolean;
  paciente: Paciente;
}

interface Paciente {
  id: number;
  precargado: boolean;
  codigoexpediente: Codigoexpediente;
}

export interface Codigoexpediente {
  id: number;
  codigo: string;
  nombre: string;
  valor: string;
  pasivo: boolean;
}

interface Servicio {
  id: number;
  codigo: string;
  especialidad: Especialidad;
  nombre: string;
  descripcion: string;
  pasivo: boolean;
}

interface Especialidad {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  pasivo: boolean;
}
