import { Perfil } from '../perfil/perfil';
export class Usuario {
    id: number = 0;
    nombre!: string;
    telefono!: string;
    username!: string;
    clave!: string;
    movil!: string;
    email!: string;
    referencia!: string;
    perfil!: Perfil;
    pasivo!: boolean;
    fechapasivo!: Date;
    indredservicio!: boolean;
    usuarioregistro!: string;
    fecharegistro!: Date;
    usuariomodificacion!: string;
    fechamodificacion!: Date;
}
