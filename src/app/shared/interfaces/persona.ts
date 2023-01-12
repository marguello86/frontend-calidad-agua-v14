export interface Persona {
  id?: number;
  registro?: number;
  personaFrk?: PersonaFrk;
  tipoPersona?: string;
  identificada?: boolean;
  identificacion?: PersonaCatalogoDetalle;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  sexo?: PersonaCatalogoDetalle;
  fechaNacimiento?: string;
  edad?: Edad;
  fallecimiento?: Fallecimiento;
  paciente?: Paciente;
  divisionPolitica?: DivisionPolitica;
  redServicio?: RedServicio;
  controlRegistro?: ControlRegistro;
  detalle: any;
}

export interface ResponsePersona {
  resultado?: number;
  error?: Error;
  paginacion?: Paginacion;
  datos?: Persona[];
}

export interface ApiGralPersona {
  id?: number;
  nombre?: string;
}

export interface ControlRegistro {
  registro?: Registro;
  modificacion?: Modificacion;
  pasivado?: Pasivado;
}

export interface Pasivado {
  usuario: ApiGralPersona;
}

export interface Modificacion {
  usuario: ApiGralPersona;
  fecha?: string;
}

export interface Registro {
  usuario: ApiGralPersona;
  sistema: ApiGralPersona;
  unidad?: ApiGralPersona;
  fecha?: string;
}

export interface RedServicio {
  residencia: Residencia2;
  ocurrencia: Residencia2;
}

export interface Residencia2 {
  sector: ApiGralPersona;
  unidadSalud: ApiGralPersona;
  entidadAdministrativa: ApiGralPersona;
}

export interface DivisionPolitica {
  nacimiento: Nacimiento;
  residencia: Residencia;
}

export interface Residencia {
  distrito: ApiGralPersona;
  comunidad: ApiGralPersona;
  municipio: ApiGralPersona;
  departamento: ApiGralPersona;
  region: ApiGralPersona;
  personaDireccion?: string;
}

export interface Comunidad {
  id?: number;
  nombre?: string;
  localidad?: PersonaCatalogoDetalle;
}

export interface Nacimiento {
  municipio: ApiGralPersona;
  departamento: ApiGralPersona;
  region: ApiGralPersona;
  pais: ApiGralPersona;
}


export interface Paciente {
  id: number;
  codigoExpediente?: CodigoExpediente;
  telefono?: string;
  precargado?: boolean;
}

export interface CodigoExpediente {
  id: number;
  codigo?: string;
  nombre?: string;
  valor: string;
}

export interface Fallecimiento {
  fallecido: boolean;
}

export interface Edad {
  anios: string;
  meses: string;
  dias: string;
}

export interface PersonaCatalogoDetalle {
  id?: number;
  codigo?: string;
  nombre?: string;
  valor?: string;
}

export interface PersonaFrk {
  id: number;
}

export interface Paginacion {
  pagina: number;
  paginaRegistros?: number;
  paginasCantidad?: number;
  paginasPendientes?: number;
  cantidadRegistros?: number;
  primera?: boolean;
  anterior?: boolean;
  siguiente?: boolean;
  ultima?: boolean;
}


export interface Error {
  id?: number;
  serverError?: string;
  path?: string;
  messageUser?: string;
  messageDeveloper?: string;
}
