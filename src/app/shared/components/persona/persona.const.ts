export const SEARCH: string = 'S';
export const EDITOR: string = 'E';
export const RESULT: string = 'R';
export const CT_SEXO_F: string = 'SEXO|F';
export const CT_SEXO_M: string = 'SEXO|M';
export const TODAY: Date = new Date(Date.now());

/******  Constantes de Identificaciones ******/
export const NO_APLICA: string = 'NA';


/****** Estructura de Cédula Nicaraguense ******/
export const LONGITUD_PRIMER_BLOQUE: number = 3;
export const LONGITUD_FECHA_NACIMIENTO: number = 6;
export const LONGITUD_ULTIMO_BLOQUE: number = 5;
export const PRIMER_BLOQUE_CEDULA_NAC: string = '777';
export const PRIMER_BLOQUE_CEDULA_EXT: string = '888';


/****** Nombre o Codigo de Nicaragua ******/
export const NICARAGUA_V1: string = 'NICARAGUA';
export const NICARAGUA_V2: string = 'NICARAGÜA';
export const NICARAGUA_CODE_ALFADOS: string = 'NI';
export const NICARAGUA_CODE_ALFATRES: string = 'NIC';

/****** Tipos de Búsqueda Persona ******/
export const LOOKUP_IDENTIFICACION: string = 'IDNTF';
export const LOOKUP_NAMES: string = 'NOMBAPELL';


/****** Variables para paginación  ******/
export const FIRST_PAGE_API: number = 1;
export const ROWS_PER_PAGE_API: number = 100;


/****** Expresiones regulares Nombres *******/
export const PATTERN_PRIMER_NOMBRE_APELLIDO: string = '^([a-zA-ZÑñÁÉÍÓÚáéíóú]){2,50}$';
export const PATTERN_SEGUNDO_NOMBRE_APELLIDO: string = '^[a-zA-ZÑñÁÉÍÓÚáéíóú]+( [a-zA-ZÑñÁÉÍÓÚáéíóú]+)*$';

/****** TypeParent for Components Child ******/
export const MOD_PRS: string = 'PRS';
export const MOD_DIALOG: string = 'DLG';

export const CANCEL: string = 'CNCL';
export const NEXT: string = 'NXT';


/**** Roles que pueden Crear Registro Persona ****/
export const ROLES_ALLOW_PERSONA: string[] = ['administrador', 'digitador', 'estadistica'];

/************ Códigos de Tipo de Persona *************/
export const PERSONA_IDENTIFICADA = 'IDNT'; // Persona Identificada
export const PERSONA_NO_IDENTIFICADA = 'NIDN'; // Persona No Identificada
export const PERSONA_RECIEN_NACIDO = 'RNAC'; // Persona Recién Nacidos
export const PERSONA_DESCONOCIDA = 'DSCN'; // Persona Desconocida (No se posee ningún tipo de Dato General de la Persona) 

/*********** División Política **********/
export const PS_NICARAGUA = 'NICARAGUA';