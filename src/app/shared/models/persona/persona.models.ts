//import { UrlWithStringQuery } from 'url';
//import { Detalleintoxicacion } from '../emergencia/consulta/consulta';

export interface ResponseBodyRequest {
    datos?: DataRequest;
    paginacion?: Paginacion;
}
export interface ResponseBodyPersona {
    resultado: number;
    error?: ErrorReponsePersona;
    paginacion?: Paginacion;
    datos?: Persona[];
    statusCode?: number;
}
interface ErrorReponsePersona {
    id: number;
    serverError: string;
    path: string;
    messageUser: string;
    messageDeveloper?: any;
}

export interface DataRequest {
    id?: number;
    nominalId?:number;
    typeLookUp?: string;
    identificada?: number;
    identificacion?: CatalogMinime;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    limitaCodigoExpediente?: boolean;
    withCodigoExpediente?: boolean;

}

export interface CatalogMinime {
    id?: number;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
    valor?: string;
    pasivo?: boolean;
    numero?: string;
}

export interface Persona {
    id?: number;
    nominalId?: number,
    registro?: number;
    personaFrk?: PersonaFrk;
    identificada?: boolean;
    identificacion?: CatalogMinime;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    sexo?: CatalogMinime;
    fechaNacimiento?: string;
    edad?: Edad;
    edadExacta?: string;
    telefono?: string;
    fallecimiento?: Fallecimiento;
    paciente?: Paciente;
    divisionPolitica?: DivisionPolitica;
    redServicio?: RedServicio;
    controlRegistro?: ControlRegistro;
    detalle?: Detalle;
    updatepersona?: boolean;
    direcciondomicilio?: string;
    comunidad?: Comunidad;
    tipoPersona?: string;
}

export interface Detalle {
    estadoCivil?: CatalogMinime;
    etnia?: CatalogMinime;
    ocupacion?: CatalogMinime;
    religion?: CatalogMinime;
    telefono?: CatalogMinime;
    tipoPersona?: CatalogMinime;
    tipoSangre?: CatalogMinime;
}

export interface ControlRegistro {
    registro?: DataAudit;
    modificacion?: DataAudit;
    pasivado?: DataAudit;
}

export interface DataAudit {
    usuario?: CatalogMinime;
    sistema?: CatalogMinime;
    unidad?: CatalogMinime;
    fecha?: string;
}

export interface RedServicio {
    residencia: RedServicioDetail;
    ocurrencia: RedServicioDetail;
}

export interface RedServicioDetail {
    sector: CatalogMinime;
    unidadSalud: CatalogMinime;
    entidadAdministrativa: CatalogMinime;
}

export interface DivisionPolitica {
    nacimiento: Nacimiento;
    residencia: Residencia;
}

export interface Residencia {
    distrito?: CatalogMinime;
    comunidad?: Comunidad;
    municipio?: CatalogMinime;
    departamento?: CatalogMinime;
    region?: CatalogMinime;
    personaDireccion?: string;
    controlRegistro?: ControlRegistro;
}
export interface Comunidad {
    id: number;
    nombre?: any;
    localidad?: PersonaFrk;
}

export interface Nacimiento {
    municipio?: CatalogMinime;
    departamento?: CatalogMinime;
    region?: CatalogMinime;
    pais?: CatalogMinime;
}


export interface Paciente {
    id?: number;
    precargado?: boolean;
    codigoExpediente?: CatalogMinime;
}

export interface Fallecimiento {
    fallecido: boolean;
}

export interface Edad {
    anios: string;
    meses: string;
    dias: string;
}

export interface PersonaFrk {
    id: number;
}


export interface Identificacion {
    id: number;
    codigo: string;
    nombre: string;
    pasivo: boolean;
    configuracionidentificacion: Configuracionidentificacion[];
}

export interface Configuracionidentificacion {
    id: number;
    descripcion: string;
    mascara: string;
    pasivo: boolean;
    longitudminima: number;
    longitudmaxima: number;
    edadminima: number;
    edadmaxima: number;
    identificacionvalida: boolean;
    pais: PaisCI;
}

export interface PaisCI {
    id: number;
    nombre: string;
    codigo: string;
    prefijotelf: number;
    pasivo: boolean;
}
export interface Paginacion {
    pagina: number;
    paginaRegistros: number;
    paginasCantidad?: number;
    paginasPendientes?: number;
    cantidadRegistros?: number;
    primera?: boolean;
    anterior?: boolean;
    siguiente?: boolean;
    ultima?: boolean;
}

export interface TipoBusqueda {
    esDesconocido?: boolean;
    esRecienNacido?: boolean;
    esNoIdentificado?: boolean;
    cancelar?: boolean;
    creacionPersona?: Creacion
}
export interface Creacion {
    persona?: boolean;
    recienNacido?: boolean;
    identificada?: boolean;
    desconocido?: boolean;
}
