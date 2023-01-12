interface CatalogoSilaisUnidad {
  status: number;
  error?: any;
  message: string;
  data: Data[];
}

interface Data {
  id: number;
  nombre: string;
  codigo: string;
  razonsocial?: string;
  direccion?: string;
  telefono?: string;
  fax?: string;
  email?: string;
  longitud: number;
  latitud: number;
  conectividad: number;
  abreviatura?: string;
  pasivo?: boolean;
  entidadesadtvas: Entidadesadtvas;
  tipoestablecimiento: Tipoestablecimiento;
  categoriaestablecimiento: Region;
  regimen: Regimen;
  region: Region;
  departamento: Departamento;
  municipio: Municipio;
  comunidad: Comunidad;
  zonaregespecial: Zonaregespecial;
  unidadadministrativa: Unidadadministrativa;
  sector: Sector;
  fechapasivo?: string;
}

interface Sector {
  id: number;
  nombre?: string;
  codigo?: string;
  sede: number;
  pasivo?: boolean;
}

interface Unidadadministrativa {
  id: number;
  longitud: number;
  latitud: number;
  conectividad: number;
  pasivo?: boolean;
  nombre?: string;
  codigo?: string;
  razonsocial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fax?: string;
}

interface Zonaregespecial {
  id: number;
  pasivo?: boolean;
  nombre?: string;
  codigo?: string;
}

interface Comunidad {
  id: number;
  nombre?: string;
  codigo?: string;
  latitud: number;
  longitud: number;
  pasivo?: boolean;
  fechapasivo?: string;
}

interface Regimen {
  id: number;
  nombre: string;
  idsuperior: number;
  pasivo?: boolean;
}

interface Tipoestablecimiento {
  idpadre: number;
  id: number;
  nombre: string;
  codigo: string;
  pasivo?: boolean;
  fechapasivo?: string;
}

export interface Entidadesadtvas {
  id: number;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono: string;
  fax: string;
  email: string;
  latitud: number;
  longitud: number;
  pasivo?: boolean;
  fechapasivo?: string;
  municipio: Municipio;
}

interface Municipio {
  id: number;
  nombre: string;
  codigo: string;
  codigocse: string;
  codigocsereg: string;
  latitud: number;
  longitud: number;
  pasivo?: boolean;
  departamento?: Departamento;
}

interface Departamento {
  id: number;
  nombre: string;
  codigo?: string;
  codigoiso: string;
  codigocse: string;
  latitud: number;
  longitud: number;
  pasivo: boolean;
  region?: Region;
  pais?: Pais;
}

interface Pais {
  id: number;
  nombre: string;
  codigo: string;
  codigoiso: string;
  codigoalfados: string;
  codigoalfatres: string;
  prefijotelf: number;
  pasivo?: boolean;
}

interface Region {
  id: number;
  nombre: string;
  codigo: string;
  pasivo?: boolean;
}
