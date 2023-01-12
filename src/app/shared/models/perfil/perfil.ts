import { Tipoperfil } from '../tipo-perfil/tipoperfil';
export class Perfil {
    id!: number;
    nombre!: string;
    descripcion!: string;
    tipoperfil!: Tipoperfil;
    pasivo!: boolean;
    fechapasivo!: Date;
    usuarioregistro!: string;
    fecharegistro!: Date;
    usuariomodificacion!: string;
    fecharmodificacion!: Date;
}

