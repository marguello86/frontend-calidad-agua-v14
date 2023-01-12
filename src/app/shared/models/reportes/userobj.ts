import { Perfil } from '../perfil/perfil';

//DAVID LOAISIGA
export interface UserObj {
    clave?: string;
    fechamodificacion?: string;
    fecharegistro?: string;
    id?: number;
    nombre: string;
    pasivo?: boolean;
    perfil?: UserPerfil;
    username?: string;
    usuariomodificacion?: string;
    usuarioregistro?: string;
}


export interface UserPerfil {
    id?: number;
    descripcion?: string;
    nombre?: string;
    pasivo?: boolean;
}