/*****     LOGIN      *****/
export const LOGIN = 'login'; // Redirige a la pagina de login

/*****     Properties LocalStorage      *****/
export const JWT = 'JWT';
export const USER = 'userObj';
export const SYSTEM = 'sistemaCA';
export const STRATEGY = 'estrategiaCie10';
export const EXP_TKN = 'expirationToken';
export const MEMBER = 'members';

/***** Código catálogos *****/
export const CAT_ANALISIS = 'CALIDADAGUA016';
export const CAT_TIPOAGUA = 'CALIDADAGUA007';

export const TIPOHOJAREMISION ={
    CLORORESIDUAL: 'CALIDADAGUA01601',
    FISICOQUIMICO: 'CALIDADAGUA01602',
    CHOLERAE: 'CALIDADAGUA01603'
};

export const ESTADOHOJAREMISION ={
    PENDIENTE: 'CALIDADAGUA00201'
};

/*****     Variables propias Sistema / API    *****/
export const CODE_SYSTEM = 'SIVCA';
export const CODE_STRATEGY_CIE10 = 'B999';
export const CHAPTER_STRATEGY_CIE10 = '01';
export const CODE_SYSTEM_PERSONA = 'PER';
export const MODULE_ENFERMEDADES_RESPIRATORIAS = '180320';


/* Variables de accion para seguimientos */
export const SEGUIMIENTO = 'seguimiento';

/* Constantes para indicar acción sobre un registro */
export const ACTION_DELETE = 'D';
export const ACTION_PASIVE = 'P';

export const STATE_DELETE = 'DELREG';
export const STATE_PASIVE = 'PASREG';
export const STATE_ACTIVE = 'ACTREG';

/* Estado de Registro para Sistema SVSC */
export const SVSC_STATE_FINALIZADO = 'SVSCESTREG|4';
export const SVSC_STATE_DELETE = 'SVSCESTREG|3';
export const SVSC_STATE_PASIVE = 'SVSCESTREG|2';
export const SVSC_STATE_ACTIVE = 'SVSCESTREG|1';


export const ROLE_ALLOW_DASHBOARD = 'administrador';
export const ROLE_ALLOW_HIGIENISTA = 'responsable de higiene';
export const ROLE_ALLOW_RECEPCIONISTA = 'recepcion';
export const ROLE_ALLOW_ANALISTA = 'analista de laboratorio';

/*** Constante utilizada para la estrategia de las enfermedades respiratorias  ***/
export const ESTRATEGIA: number = 6969;

/***
 * CONSTANTE DE CATALOGOS EMERGENCIA
 */
export const CODIGO_CATALOGO_AREA = 'ASRVMED';
export const TITULO_ESTADO_PACIENTE = 'ESTADOPACIENTE';
export const TITULO_DESTINO_PACIENTE = 'DESTPXTERCONS';
export const ESTADO_PACIENTE_FALLECIDO = 'ESTADOPACIENTE|FALLECIDO';
export const ESTADO_PACIENTE_LLEGO_MUERTO = 'ESTADOPACIENTE|FALLECIDO';
export const ESPECIALIDADCODIGO = 'SRVP'; //SERVICIOS ASISTENCIALES PRINCIPALES DE LA UNIDAD DE SALUD
export const CODIGO_OCURRENCIA_ACCIDENTE = 'ERLACCVIO';
export const CODIGO_CAUSA_EXTERNA = 'ERCACCVIO';
export const CODIGO_VIOLENCIA_INTRAFAMILIAR = 'VIOLINTRAFAM';
export const CODIGO_TIPO_INTOXICACION = 'TIPOINTOX';
export const CODIGO_TIPO_CAUSA_INTOXICACION = 'TIPOCAUXINTOX';
export const CODIGO_TIPO_AGRESOR = 'TAGRESORVF';
export const CODIGO_AGENTE_TOXICO = 'ATOXICO';
/*Contstantes de Reportes */
export const LOGO_RPT_PDF = ''
/*Contstantes de Reportes */
export const CODIGO_OCUPACION = 'OCUPACIONES' //'HSF_OCUPA';
export const CODIGO_CAUSA_EXTERNA_VIOLENCIA = 'EMERCV'
export const CODIGO_TIPO_URGENCIA_EMERGENCIA = 'TPURGENCIA'
export const CODIGO_TIPO_REFERENCIA = 'TREF';
export const ESTADO_ADMISION = 'ESTADM01';
export const ADMISION_FINALIZADA = 'ESTADM02';
export const REMITIDO_OBSERVACION = 'ESTADM03';
export const INGRESADO_OBSERVACION = 'ESTADM04';
export const ATENDIDO_OBSERVACION = 'ESTADM05';
export const ESTADO_ADMISION_PENDIENTE = 'ESTADM05';
export const CODIGO_TIPO_URGENCIA_MEDICA = 'TPURGENCIA|MED';

//**** VALOR APROXIMADA DE UNA SEMANA
export const SEMANA = 4.3482;

/*
* CATALOGO DE ESCALAS DE DATOS CLINICOS CARDIACA
*/
export const CODIGO_FRECUENCIA_CARDIACA = 'ESCFRQCARDIO';
export const CODIGO_FRECUENCIA_CARDIACA_01 = 'ESCFRQCARDIO01';
export const CODIGO_FRECUENCIA_CARDIACA_02 = 'ESCFRQCARDIO02';
export const CODIGO_FRECUENCIA_CARDIACA_03 = 'ESCFRQCARDIO03';
export const CODIGO_FRECUENCIA_CARDIACA_04 = 'ESCFRQCARDIO04';
export const CODIGO_FRECUENCIA_CARDIACA_05 = 'ESCFRQCARDIO05';
export const CODIGO_FRECUENCIA_CARDIACA_06 = 'ESCFRQCARDIO06';
export const CODIGO_FRECUENCIA_CARDIACA_07 = 'ESCFRQCARDIO07';

/*
* CATALOGO DE ESCALAS DE DATOS CLINICOS RESPIRATORIO
*/
export const CODIGO_FRECUENCIA_RESPIRATORIA = 'FRQRESPIRATORIA';
export const CODIGO_FRECUENCIA_RESPIRATORIA_01 = 'FRQRESPIRATORIA01';
export const CODIGO_FRECUENCIA_RESPIRATORIA_02 = 'FRQRESPIRATORIA02';
export const CODIGO_FRECUENCIA_RESPIRATORIA_03 = 'FRQRESPIRATORIA03';

/*
* CATALOGO DE ESCALAS DE TEMPERARUTA
*/
export const CODIGO_ESCALA_TEMPERATURA = 'ESCTEMPERATURA';
export const CODIGO_ESCALA_TEMPERATURA_01 = 'ESCTEMPERATURA01';
export const CODIGO_ESCALA_TEMPERATURA_02 = 'ESCTEMPERATURA02';
export const CODIGO_ESCALA_TEMPERATURA_03 = 'ESCTEMPERATURA03';
export const CODIGO_ESCALA_TEMPERATURA_04 = 'ESCTEMPERATURA04';
export const CODIGO_ESCALA_TEMPERATURA_05 = 'ESCTEMPERATURA05';
/*
* CATALOGO DE ESCALAS SISTOLICA
*/
export const CODIGO_ESCALA_SISTOLICA = 'ESCPARTERIAL';
export const CODIGO_ESCALA_SISTOLICA_01 = 'ESCPARTERIAL01';
export const CODIGO_ESCALA_SISTOLICA_02 = 'ESCPARTERIAL02';
export const CODIGO_ESCALA_SISTOLICA_03 = 'ESCPARTERIAL03';
export const CODIGO_ESCALA_SISTOLICA_04 = 'ESCPARTERIAL04';
export const CODIGO_ESCALA_SISTOLICA_05 = 'ESCPARTERIAL05';
export const CODIGO_ESCALA_SISTOLICA_06 = 'ESCPARTERIAL06';
export const CODIGO_ESCALA_SISTOLICA_07 = 'ESCPARTERIAL07';
/*
* CATALOGO DE ESCALAS DIASTOLICA
*/
export const CODIGO_ESCALA_DIASTOLICA = 'ESCPARTDIASTOLICA';
export const CODIGO_ESCALA_DIASTOLICA_01 = 'ESCPARTDIASTOLICA01';
export const CODIGO_ESCALA_DIASTOLICA_02 = 'ESCPARTDIASTOLICA02';
export const CODIGO_ESCALA_DIASTOLICA_03 = 'ESCPARTDIASTOLICA03';
export const CODIGO_ESCALA_DIASTOLICA_04 = 'ESCPARTDIASTOLICA04';
export const CODIGO_ESCALA_DIASTOLICA_05 = 'ESCPARTDIASTOLICA05';
export const CODIGO_ESCALA_DIASTOLICA_06 = 'ESCPARTDIASTOLICA06';
export const CODIGO_ESCALA_DIASTOLICA_07 = 'ESCPARTDIASTOLICA07';
/*
* CATALOGO DE ESCALAS GLUCOSA
*/
export const CODIGO_ESCALA_GLUCOSA = 'ESCGLUCOSA';
export const CODIGO_ESCALA_GLUCOSA_01 = 'ESCGLUCOSA01';
export const CODIGO_ESCALA_GLUCOSA_02 = 'ESCGLUCOSA02';
export const CODIGO_ESCALA_GLUCOSA_03 = 'ESCGLUCOSA03';
export const CODIGO_ESCALA_GLUCOSA_04 = 'ESCGLUCOSA04';

/*
 *OPCIONES DE MENU
 */
export const CODIGO_INICIO_EMERGENCIA = 'EMERGENCIA001';
export const CODIGO_ADMISION_EMERGENCIA = 'EMERGENCIA002';
export const CODIGO_CLINICO_EMERGENCIA = 'HClinica'/*'EMERGENCIA003'*/;
export const CODIGO_CONSULTA_EMERGENCIA = 'EMERGENCIA004';
export const CODIGO_OBSERVACION_EMERGENCIA = 'EMERGENCIA005';
export const CODIGO_REPORTE_EMERGENCIA = 'EMERGENCIA006';
export const CODIGO_NOMINAL_EMERGENCIA = 'EMERGENCIA007';
export const CODIGO_EMISION_DOCUMENTOS = 'EMERGENCIA008';
/*
 * ACCIONES DE MENU
 */
export const PERMISO_GUARDAR = 'PERMISOS_USERS|GUARDAR';
export const PERMISO_BUSCAR = 'PERMISOS_USERS|BUSCAR';
export const PERMISO_IMPRIMIR = 'PERMISOS_USERS|IMPRIMIR';
export const PERMISO_MODIFICAR = 'PERMISOS_USERS|MODIFICAR';
export const PERMISO_PASIVAR = 'PERMISOS_USERS|PASIVAR'
export const PERMISO_ELIMINAR = 'ELMREGISTRO'
export const PERMISO_ABRIR_MODAL = 'POPENMODAL'

/*
* MOMENTO DE MEDICIÓN DE EMERGENCIA, TRIAGUE
 */
export const MOMENTO_MEDICION_EMERGENCIA = 'MTDTCLINICO01'

export const MOMENTO_MEDICION_TRIAGE = 'MTDTCLINICO01'
export const MOMENTO_MEDICION_CONSULTA_EMERGENCIA = 'MTDTCLINICO03'
export const MOMENTO_MEDICION_OBSERVACION = 'MTDTCLINICO04'

/**
 * UNIDAD DE USUARIO EMERGENCIA
 */
export const UNIDAD_USUARIO = 'unidadUsuario'
export const CODIGO_NOTA_EVOLUCION = 'TPINSTNTEVT'
export const DET_NOTA_EVOLUCION = 'NTEVTPRBEV'
export const DET_NOTA_PLANES = 'NTEVTPLNS'

export const TIPO_NOTA_CONSULTA = 'CONSULTA';
export const TIPO_NOTA_OBSERVACION = 'OBSERVACION';

export const CATEGORIA_INSS = 'SS';
export const FFUENTEFINANCIA = 'FFINANCIA|INSS';
export const DESTINO_CONSULTA = 'CONSULTA';
export const DESTINO_OBSERVACION = 'OBSERVACION';
export const SEXOM = 'SEXO|M';
export const SEXOF = 'SEXO|F';

export const ESTADO_EGRESO_DESTPXTERCONS_OBSERVACION = 'DESTPXTERCONS|OBSERVACION';
export const ESTADO_EGRESO_DESTPXTERCONS_ABANDONO = 'DESTPXTERCONS|ABANDONO' ;

export const ESTADO_EGRESO_DESTPXTERCONS_PENDIENTE='DESTPXTERCONS|PENDIENTE';
