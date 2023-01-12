import { Sistema } from '../sistema/sistema';
export class Rol {
    id: number;
    nombre: string;
    pasivo: boolean;
    fechapasivo: Date;
    usuarioregistro: string;
    fecharegistro: Date;
    usuariomodificacion: string;
    fechamodificacion: Date;
    sistema: Sistema;
}
