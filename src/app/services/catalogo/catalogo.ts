export interface Catalogo {
    id?: number;
    catalogosup?: number;
    nombre?: string;
    codigo?: string;
    valor?: string;
    descripcion?: string;
    orden?: number;
    final1?: number;
    pasivo?: boolean;
    usuarioregistro?: string;
    usuariomodificacion?: string;
    childrens?: Catalogo[];
    controlRegistro?: ControlRegistro;
}

export interface ControlRegistro {
    sistemaProcedenciaId?: number;
    sistemaProcedenciaNombre?: string;
    unidadSaludProcedenciaId?: number;
    unidadSaludProcedenciaNombre?: string;
    pasivo?: boolean;
    fechaPasivo?: Date;
    usuarioregistro?: string;
    fechaRegistro?: Date;
    usuarioModificacion?: string;
    fechaModificacion?: Date;
}
