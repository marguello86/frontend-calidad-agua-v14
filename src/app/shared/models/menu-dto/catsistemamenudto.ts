import { Rol } from '../rol/rol';
import { Relmenurecursodto } from './relmenurecursodto';
export class Catsistemamenudto {
    id!: number;
    codigo!: string;
    nombre!: string;
    descripcion!: string;
    pasivo!: boolean;
    rol!: Rol[];
    menu!: Relmenurecursodto[];
}
