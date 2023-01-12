import { Persona } from 'src/app/shared/models/persona/persona.models';
/*
* 19/10/2020
* SE CREA ESTA INTERFAZ CON LOS DATOS QUE SE RETORNAN DE LA API DE PERSONAL MINSA
*/
import { Catalogo } from "../catalogo/catalogo";

export interface DataPersonalMinsa {
    id?: number;
    codigo?: string;
    persona?: PersonaMinsa;
    relProfTitulos?: RelacionProfesionTitulos;
    tipoPersonal?: TipoPersonal;
    indPublico?: boolean;
    pasivo?: boolean;
    usuarioRegistro?: string;
    fechaRegistro?: string;
}

/*
* INTERFAZ PARA MANEJAR EL TIPO DE DATO PERSONA
*/
export interface PersonaMinsa {
    id?: number;
    codigo?: string;
    tipoIdentificacion?: string;
    identificacion?: string;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    fechaNacimiento?: string
    sexo?: string;
    direccion?: string;
    municipio?: Municipio;
    muniResidencia?: MunicipioResidencia;
}
/*
* INTERFAZ PARA MANEJAR EL TIPO DE DATO MUNICIPIO
*/
export interface Municipio {
    id?: number;
    nombre?: string;
    codigo?: number;
    codigoCse?: string;
    codigoCseReg?: string;
    latitud?: number;
    longitud?: number;
    pasivo?: boolean;
    departamento?: Departamento;
}
/*
* INTERFAZ PARA MANEJAR EL TIPO DE DATO DEPARTAMENTO
*/
export interface Departamento {
    id?: number;
    nombre?: string;
    codigo?: string;
    codigoIso?: string;
    codigoCse?: string;
    latitud?: number;
    longuitud?: number;
    pasivo?: boolean;
    region?: Region;
    pais?: Pais;
}
/*
* INTERFAZ PARA MANEJAR EL TIPO DE DATO REGION
*/
export interface Region {
    id?: number;
    nombre?: string;
    codigo?: string;
    pasivo?: boolean;
}
/*
 * INTERFAZ PARA MANEJAR EL TIPO DE DATO PAIS
 */
export interface Pais {
    id?: number;
    nombre?: string;
    codigo?: number;
    codigoIso?: string;
    codigoAlfaDos?: string;
    codigoAlfaTres?: string;
    prefijoTelf?: number;
    pasivo?: boolean;
}
/*
* INTERFAZ PARA MANEJAR EL TIPO DE DATO MUNICIO DE RESIDENCIA
*/
export interface MunicipioResidencia {
    id?: number;
    nombre?: string;
    codigo?: string;
    codigoCse?: string;
    codigoCseReg?: string;
    latitud?: number;
    longitud?: number;
    pasivo?: boolean;
    departamento?: Departamento;
}
/*
* INTERFAZ QUE MANEJA EL TIPO DE DATO RELACION PROFESIÓN TITULOS
*/
export interface RelacionProfesionTitulos {
    id?: number;
    titulo?: Titulo;
    pasivo?: boolean;
}
/*
* INTERFAZ PARA MANEJAR EL TIPO DE DATO TITULO
*/
export interface Titulo {
    id?: number;
    nombre?: string;
    pasivo?: boolean;
}
/**
 * INTERFAZ PARA MANEJAR EL TIPO DE DATO TIPO PERSONAL
 */
export interface TipoPersonal {
    id?: number;
    catalogSup?: number;
    codigo?: string;
    valor?: string;
    descripcion?: string;
    orden?: number;
    final?: number;
    pasivo?: boolean;
}
/*
* SE DEFINE LA INTERFAZ PARA EL CUERPO DE LA PETICION
*/
export interface SolicitudRespuesta {
    datos?: DatosDeEnvio;
    paginacion?: Paginacion;
}
/*
* SE DEFINE LOS PARAMETROS QUE SE ENVIARAN EN LA PETICION
*/
export interface DatosDeEnvio {
    identificacion?: string;
    pagactual?: number;
    pagscantidad?: number;
    primerapellido?: string;
    primernombre?: string;
    segundoapellido?: string;
    segundonombre?: string;
    tipofiltro?: number;
}
/**
 * SE DEFINE INTERFAZ PARA LOS VALORES MINIMOS DE LA IDENTIFICACION
 */
export interface CatalogoMinimo {
    id?: number;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
    valor?: string;
}
/*
* SE DEFINE LA ESTRUCTURA PARA LA PAGINACIÓN DE LA LISTA DE PERSONAL MEDICO
*/
export interface Paginacion {
    pagina?: number;
    paginaRegistros?: number;
    paginasCantidad?: number;
    paginasPendientes?: number;
    cantidadRegistros?: number;
    primera?: boolean;
    anterior?: boolean;
    siguiente?: boolean;
    ultima?: boolean;
}
/**
 * SE DEFINE LA RESPUESTA DE LA OBTENCION DE LOS DATOS DEL PERSONAL MINSA
 */
export interface Respuesta {
    datosTabla?: DatosTabla;
    titulo?: Titulo;
    minsapersonal?: MinsaPersonal;
    servicios?: Catalogo[];
}

/**
 * DATOS DEL REGISTRO DE TABLA DE LA BASE DE DATOS
 */
export interface DatosTabla {
    id?: number;
    indPublico?: string;
    pasivo?: boolean;
    usarioRegistro?: string;
    fechaRegistro?: string
}


export interface MinsaPersonal {
    id?: number;
    indPublico?: string;
    pasivo?: boolean;
    usarioRegistro?: string;
    fechaRegistro?: string
    tipopersonal?: Catalogo;
    persona?: Persona;
}

export interface SalidaDatosPersonal {
    id?: number;
    identificacion?: string;
    codigoPersonal?: string;
    sexo?: string;
    fechaNacimiento?: string;
    nombreCompleto?: string;
    dataPersonal?: DataPersonal;
    Area?: Catalogo
}

export interface DatosIngresoPersonal{
    horaIngreso?:string;
    horsaSalida?:string;
    areaPertenece?:CatalogoMinimo;
}
export interface ConsultaPersonal{
    personalMinsa?:SalidaDatosPersonal
    ingreso?: DatosIngresoPersonal
}
interface DataPersonal {
  id?: number;
  codigo?: string;
  //persona?: Persona;
  relproftitulos?: Relproftitulos;
  mperssalud?: Mperssalud;
  mperscargos?: Mperscargos;
  tipopersonal?: Tipopersonal;
  indpublico?: boolean;
  pasivo?: boolean;
  usuarioregistro?: string;
  fecharegistro?: string;
}

interface Tipopersonal {
  id?: number;
  catalogosup?: number;
  codigo?: string;
  valor?: string;
  descripcion?: string;
  orden?: number;
  final1?: number;
  pasivo?: boolean;
}

interface Mperscargos {
  id?: number;
  cargos?: Cargos;
  dependencia?: Dependencia;
  usalud?: Usalud2;
  pasivo?: boolean;
}

interface Usalud2 {
  id?: number;
  longitud?: number;
  latitud?: number;
  conectividad?: number;
  pasivo?: boolean;
  tipoestablecimiento?: Tipoestablecimiento;
  categoriaestablecimiento?: Tipo;
  regimen?: Regimen;
  comunidad?: Comunidad;
  zonaregespecial?: Tipo;
}

interface Comunidad {
  id?: number;
  latitud?: number;
  longitud?: number;
  pasivo?: boolean;
  municipio?: Municipio2;
}

interface Municipio2 {
  id?: number;
  latitud?: number;
  longitud?: number;
  pasivo?: boolean;
  departamento?: Departamento2;
}

interface Departamento2 {
  id?: number;
  latitud?: number;
  longitud?: number;
  pasivo?: boolean;
  region?: Tipo;
  pais?: Pais2;
}

interface Pais2 {
  id?: number;
  prefijotelf?: number;
  pasivo?: boolean;
}

interface Regimen {
  id?: number;
  idsuperior?: number;
  pasivo?: boolean;
}

interface Tipoestablecimiento {
  idpadre?: number;
  id?: number;
  pasivo?: boolean;
}

interface Dependencia {
  id?: number;
  tipo?: Tipo;
  indpublico?: number;
  pasivo?: boolean;
}

interface Tipo {
  id?: number;
  pasivo?: boolean;
}

interface Cargos {
  id?: number;
  tipocargo?: Turnoatiende;
  pasivo?: boolean;
}

interface Mperssalud {
  id?: number;
  personalxusalud?: Personalxusalud;
  registroSanitario?: string;
  pasivo?: boolean;
}

interface Personalxusalud {
  id?: number;
  usalud?: Usalud;
  turnoatiende?: Turnoatiende;
  pasivo?: boolean;
}

interface Turnoatiende {
  id?: number;
  catalogosup?: number;
  orden?: number;
  final1?: number;
  pasivo?: boolean;
}

interface Usalud {
  id?: number;
  longitud?: number;
  latitud?: number;
  conectividad?: number;
  pasivo?: boolean;
}

interface Relproftitulos {
  id?: number;
  titulo?: Titulo;
  pasivo?: boolean;
}
