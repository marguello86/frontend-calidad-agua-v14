export interface DetPxVisita {
  id: number;
  paciente: PacienteV;
  unidadsalud: UnidadsaludV;
  codigofrecuencia: string;
  fechavisita: string;
  pasivo: boolean;
  usuarioregistro: string;
  fecharegistro: string;
}

export interface UnidadsaludV {
  id: number;
  nombre: string;
  codigo: string;
  direccion: string;
  pasivo: boolean;
}

export interface PacienteV {
  id: number;
  codigoexpediente: string;
  desconocido: boolean;
  pasivo: boolean;
  persona: PersonaV;
  tipopaciente: CatalogoV;
  tipoexpediente: CatalogoV;
}

export interface CatalogoV {
  id: number;
  nombre: string;
  codigo: string;
  pasivo: boolean;
}

export interface PersonaV {
  id: number;
  identificada: boolean;
  primernombre: string;
  segundonombre: string;
  primerapellido: string;
  segundoapellido: string;
  nombrecompleto: string;
  fechanacimiento: string;
  sexo: string;
  direcciondomicilio: string;
}
