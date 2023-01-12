import { Persona } from './persona.models';

export interface ConfigurationDialogPersona {
    title: string;
    subTitle: string;
    actionRequest: string;
    data: any;
    configLimitPerson: ConfigLimitPerson;
    actionResult?: string;
    personSelect?: Persona;
    personCoincidence?: Persona[];
}

export interface ConfigLimitPerson {
    limitAge?: boolean;
    minAge?: number;
    maxAge?: number;
    limitPersonIdentificada?: boolean;
    justLimitIdentificada?: boolean;
    justLimitNoIdentificada?: boolean;
}