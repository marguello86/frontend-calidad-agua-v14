import { Recurso } from '../recurso/recurso';
import { Catalogo } from '../catalogo/catalogo';
import { Rol } from '../rol/rol';
export class Relmenurecursodto {
    id!: number;
    nombre!: string;
    codigo!: string;
    orden!: number;
    dependencia!: number;
    pasivo!: boolean;
    recurso!: Recurso;
    permisos!: Catalogo[];
    menurol!: Rol;
    childrens?: Relmenurecursodto[];
    ver?: boolean;
}
