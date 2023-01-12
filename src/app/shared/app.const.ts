export const ROL_ADMINISTRADOR_FULL: string = 'administrador full'

/******** Constantes Parámetros *********/
export const PRIMARY_KEY = 'PRK';
export const EXPEDIENTE = 'EXP';
export const UNIDAD_SALUD = 'USL';
export const SCHEMA_EMERGENCIA = 'E';
export const SCHEMA_CONSULTA_EXTERNA = 'C';
export const SCHEMA_HOSPITALIZACION = 'H';
export const SCHEMA_REFCONTRAREF = 'R';


/******** Constantes para mensaje *********/
export const TITLE_MESSAGE_NETWORK = 'Inconvenientes de Comunicación';
export const MESSAGE_NETWORK = 'Ha ocurrido un inconveniente, en la solicitud realizada, reintente nuevamente o contacte al administrador.';

/******** Estados del Paciente ************/
export const CAT_H_ESTADOS_PACIENTE = 'ESTADOPACIENTE';
export const CAT_H_ESTADO_PACIENTE_ESTABLE = 'ESTADOPACIENTE|ESTABLE';
export const CAT_H_ESTADO_PACIENTE_CRITICO = 'ESTADOPACIENTE|CRITICO';
export const CAT_H_ESTADO_PACIENTE_FALLECIDO = 'ESTADOPACIENTE|FALLECIDO';

/******** Procedencia de Solicitud Ingreso ************/
export const CAT_PROCEDENCIA_PARA_INGRESO = 'INGRESOPOR';
export const CAT_PRC_INGRESO_EMERGENCIA = 'INGRESOPOR|EMERGENCIA';
export const CAT_PRC_INGRESO_CONSLT_EXT = 'INGRESOPOR|CONSULTAEXT';
export const CAT_PRC_INGRESO_REFCONTRAREF = 'INGRESOPOR|REFERIDOUNIDAD';

/******** Es Reingreso ************/
export const CAT_ES_REINGRESO = 'REINGRESO';
export const CAT_ES_REINGRESO_SI = 'REINGRESO|SI';
export const CAT_ES_REINGRESO_NO = 'REINGRESO|NO';


/******** Egreso ************/
export const CAT_C_TIPO_EGRESO: string = 'TIPOEGRESO';
export const CAT_C_TIPO_EGRESO_ALTA: string = `${CAT_C_TIPO_EGRESO}|ALTA`;

export const CAT_C_TIPO_EGRESO_REFERIDO: string = `${CAT_C_TIPO_EGRESO}|REFUNIDAD`;
export const LBL_SIN_CONTRAREFERENCIA: string = `Sin Contrareferencia`;
export const LBL_CONTRAREFERIR: string = `Contrarreferir`;

export const CAT_C_TIPO_REFERENCIA_URGENTE_NO_URGENTE: string = 'TREF';

export const CAT_C_TIPO_REFERENCIA_ADECUADA_INADECUADA: string = 'REFADIN';
export const CAT_C_TIPO_REFERENCIA_ADECUADA: string = 'REFADEC';
export const CAT_C_TIPO_REFERENCIA_INADECUADA: string = 'REFINAD';

/******** Egreso | Primer Bloque Egreso - Tipo Accidente ************/
export const PRIMER_BLOQUE_EGRESO: string = 'PFBLEG';

/******** Egreso | Infección IntraHospitalaria ************/
export const CAT_C_EGRESO_TIPO_INFECCION_INTRA_HOSP: string = 'EGREINFECCHOSP';
export const CAT_C_EGRESO_OTRO_TIPO_INFECCION_INTRA_HOSP: string = `${CAT_C_EGRESO_TIPO_INFECCION_INTRA_HOSP}|OTRA`;

/******** Egreso | Tipo Trauma ************/
export const CAT_C_EGRESO_TIPO_TRAUMA: string = 'EGRESOTRAUMA';

/******** Catálogo de Acciones ************/
export const CAT_C_ACT_BUSCAR = 'PERMISOS_USERS|BUSCAR';
export const CAT_C_ACT_AGREGAR = 'PERMISOS_USERS|GUARDAR';
export const CAT_C_ACT_APROBAR = 'PERMISOS_USERS|APROBAR';
export const CAT_C_ACT_MODIFICAR = 'PERMISOS_USERS|MODIFICAR';
export const CAT_C_ACT_PASIVAR = 'PERMISOS_USERS|PASIVAR';
export const CAT_C_ACT_NOTAS_EVOL_TRAT = 'PERMISOS_USERS|TRIAGE';
export const CAT_C_ACT_ELMINAR = 'ELMREGISTRO';
export const CAT_C_ACT_PRINCIPAL = 'SPRINCIPAL';
export const CAT_C_ACT_CANCELAR = 'CANCELAR';
export const CAT_C_ACT_IMPRIMIR = 'PERMISOS_USERS|IMPRIMIR';
export const CAT_C_ACT_ABRIR_MODAL = 'POPENMODAL';

export const CAT_NOT_ACTION = 'Sin Coincidencia';

/******** Mensajes por Rol ************/
export const TITLE_MSG_ROL = 'Acción No Permitida';
export const BODY_MSG_ROL = 'Usted no cuenta con los permisos para realizar esta acción';



export const TYPE_VIEW_PERSONA_NORMAL = 'PRN_NORMAL';
export const TYPE_MODE_VIEW_PROFILE = 'COMPACT';
export const TYPE_MODE_VIEW_PROFILE_COMPACT_INLINE = 'INLINE';

export enum TypeCRUD {
    CREATE = 'C',
    READ = 'R',
    UPDATE = 'U',
    DELETE = 'D'
}


export const ADMISION_PARENT_FINDER = 'ADM';
export const INGRESO_PARENT_FINDER = 'ING';
export const EGRESO_PARENT_FINDER = 'EGR';

export const FINDER_WITHOUT_RED_SERVICIO = 'FSRS';
export const FINDER_WITH_RED_SERVICIO = 'FCRS';

export const TIPO_BUSQUEDA_EGRESO = 'E';

/********************* Formatos Fechas *********************/
export const FRMT_YYYY_MM_DD_LOOKUPS: string = 'YYYY-MM-DD';//Formato de fechas usados en las busquedas
export const FRMT_YYYY_MM_DD_LOOKUPS_FORMATED: string = 'YYYY-MM-DD HH:mm:ss';//Formato de fechas usados en las busquedas
export const FRMT_DD_MM_YYYY_HH24_MM_SS: string = 'DD-MM-YYYY HH:mm:ss';//Formato con hora militar
export const FRMT_DD_MM_YYYY_HH_MM_SS_AM_PM: string = 'DD-MM-YYYY hh:mm:ss a';// Formato de 12 horas [AM/PM]

/************ Catálogo de Estados Preingresos **************/
export const CAT_ESTADO_PREINGRESO_PENDIENTE_ID: number = 7648;
export const CAT_ESTADO_PREINGRESO_PENDIENTE: string = 'STSLPRG|PND';
export const CAT_ESTADO_PREINGRESO_INGRESADO: string = 'STSLPRG|ING';
export const CAT_ESTADO_PREINGRESO_EGRESADO: string = 'STSLPRG|EGR';

export const SCHEMA_FINDER_CAMA_ING: string = 'finder-camas-ingresos';

/************ Catálogo de Estados Registros ***************/
export const CAT_C_STD_REGISTROS: string = 'STREG';
export const CAT_C_STD_REG_ACTIVO: string = 'ACTREG';
export const CAT_C_STD_REG_PASIVO: string = 'PASREG';
export const CAT_C_STD_REG_ELIMINADO: string = 'DELREG';
export const CAT_C_STD_REG_PRECARGADO: string = 'PRCREG';
export const CAT_C_STD_REG_UNIFICADO: string = 'UNIFREG';

/************ Catálogo de Tipos Constancias Administratias ***************/
export const CAT_C_TP_CONST_ADMIN: string = 'TCONSTAD';
export const CAT_C_TP_CONST_ADMIN_CONSENTIMIENTO_INFORMADO: string = 'TCONSTAD03';

/************ Catálogo de Tipos Instrumentos Notas ***************/
export const CAT_C_TP_INST_NOTA: string = 'TPINSTNT';
export const CAT_C_TP_INST_NOTA_ENFERMERIA: string = 'TPINSTNTENF';
export const CAT_C_TP_INST_NOTA_EVOL_TRATAMIENTO: string = 'TPINSTNTEVT';


/************ Catálogo Contextual Menu  *************/
export const CODE_RECURSO_CONTEXTUAL_MENU: string = 'TpRec|MC';
export const CODE_CAT_MENU_CREAR_INGRESO: string = 'SHIEGHPCI';
export const CODE_CAT_MENU_ADM_NOTAS_ENFERMERIA: string = 'EMENOTASENF';
export const CODE_CAT_MENU_ADM_NOTAS_ENFERMERIA_OBSERVACION: string = 'OBSNOTENF';
export const CODE_CAT_MENU_ADM_NOTAS_EVOL_TRATAMIENTO: string = 'EMENOTASEVOTRA';
export const CODE_CAT_MENU_ADM_NOTAS_EVOL_TRATAMIENTO_OBSERVACION: string = 'OBSNOTASEVOLTRA';
export const CODE_CAT_MENU_ADM_TRASLADOS_ENTRE_SERVICIOS: string = 'SHIEGHITS';
export const CODE_CAT_MENU_ADM_REVERSION_EGRESO: string = 'SHIEGHERV';

export const CODE_CAT_MENU_ADM_CONTROL_DE_MEDICAMENTOS: string = 'EMECTROLMEDIC';
export const CODE_CAT_MENU_ADM_CONTROL_DE_MEDICAMENTOS_OBSERVACION: string = 'OBSCTROLMED';

export const CODE_CONSULTA_DATOS_PENDIENTES: string = 'DESTPXTERCONS|PENDIENTE';
export const CODE_FINANCIA_SEGURO_SOCIAL: string = 'SS';
export const CODE_C_INFORMADO_EMERGENCIA: String = 'EMERCONSINFO';
export const CODE_C_INFORMADO_OBSERVACION: String = 'OBSCONSINFO';


export const CODE_CAT_SERVICIO_EMERGENCIA: String = 'SRVP01';
export const CODE_CAT_SERVICIO_OBSERVACION: String = 'SRVP02';


