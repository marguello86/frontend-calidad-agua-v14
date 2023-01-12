import { Paginacion } from './persona.models';

export interface PersonaBusquedaCriterio {
    id?: number;
    tipoBusqueda?: string;
    numeroIdentificacion?: string;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    sexo?: string;
    difunto?: boolean;
    completo?: number;
    tipoPersona?: number;
    paisId?: number;
    municipioId?: number;
    departamentoId?: number;
    paginacion?: Paginacion;
    identificada?: number;
}
