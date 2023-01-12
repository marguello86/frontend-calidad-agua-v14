export interface UtilitarioEdad {
    Anio?: number;
    Meses?: number;
    Semanas?: number;
    Dias?: number;
}

export interface RangoEdadesDatoClinico {
    id: number
    codigo: string;
    descripcion?: string;
    orden?: string;
    valor?: string;
    rango?: Rango
}

interface Rango {
    valorminima?: number;
    valormaxima?: number;
}