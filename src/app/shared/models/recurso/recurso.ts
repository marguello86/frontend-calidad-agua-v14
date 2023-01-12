import { Sistema } from '../sistema/sistema';
import { Catalogo } from '../catalogo/catalogo';
export class Recurso {
     id!: number;
     nombre!: string;
     descripcion!: string;
     url!: string;
     pasivo!: boolean;
     fechapasivo!: Date;
     usuarioregistro!: string;
     fecharegistro!: Date;
     usuariomodificacion!: string;
     fechamodificacion!: Date;
     sistema!: Sistema;
     tiporecurso!: Catalogo;
}
