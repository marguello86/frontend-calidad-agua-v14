export interface Silais {
    id: number;
    codigo: number
    direccion: string;
    pasivo: string;
    unidades: any
}

export interface silaisPorUsuario {
    central?: number;
    codigo?: string;
    direccion?: string;
    email?: string;
    fax?: string;
    fechamodificacion?: string;
    fechapasivo?: string;
    fecharegistro?: string;
    id?: number;
    latitud?: number;
    longitud?: number;
    municipio?: any;
    nombre?: string;
    pasivo?: boolean;
    telefono?: string;
    usuariomodificacion?: string;
    usuarioregistro?: string;
}
export interface silaisUnidadesUsuario {
    codigo?: string;
    direccion?: string;
    id?: number;
    nombre?: string;
    pasivo?: boolean;
    telefono?: string;
    unidades?: any;
    abreviatura?: string;
    categoriaid?: number;
    comunidad?: any;
    municipio?: any;
    regimen?: number
    sector?: any;
    tipoestablecimiento?: any;
    tipounidad?: any;
}

export interface ServicioUnidadSalud{
    servicioId: number;
    unidadSaludId: number;
    nomUniSalud: string;
    nomServicio: string;
    descUniSalud: string;
  }