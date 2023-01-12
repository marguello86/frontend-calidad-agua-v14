import { Persona } from "src/app/shared/models/persona/persona.models";

export interface RespuestaRetorno {
    cancelar: boolean;
    persona: Persona;
    mostrar?: boolean;
}