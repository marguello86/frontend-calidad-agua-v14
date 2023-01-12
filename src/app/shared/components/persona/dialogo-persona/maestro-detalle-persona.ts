import { Persona } from 'src/app/shared/models/persona/persona.models'

export interface MaestroDetallePersona {
    id?: number;
    identificacion?: string;
    codigoExpediente?: string;
    nombreCompleto?: string;
    departamento?:string;
    municipio?:string;
    comunidad?:string;
    pais?:string
    edad?:string;
    sexo?:string;
    direccion?: string;
    sector?:string;
    persona?: Persona;
    clasificacion?: string;
}