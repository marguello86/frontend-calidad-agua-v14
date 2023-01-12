import { Catalogos } from './catalogos';
import { DetalleSexualidad } from './detalle-sexualidad';

export class Sexualidad {
    historiaClinicaId	?:number;
    sexualidadId	?:number;
    relacionesSexuales?:	Catalogos;
    parejaSexual?:	Catalogos;
    edadInicioSexual	?:number
    relacionCoercion?:	Catalogos;
    dificultadRelacion?:	Catalogos;
    usoAnticonceptivos?:	Catalogos;
    usoCondon?:	Catalogos;
    consejeria?:	Catalogos;
    acoEmergenciaNo	?:number;
    observaciones?:	string;
    detalleanticonceptivos?: DetalleSexualidad[];
    estadoRegistro	?:number;
    usuarioRegistro?:	string;
    fechaRegistro?:	Date;
    usuarioModificacion?: string;
    fechaModificacion?:	Date;
    acoEmergencia?:	Catalogos;
    }



