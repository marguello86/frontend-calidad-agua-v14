export interface DatosClinicosPorFecha {
    fecharegistro: string;
    general: General;
    minsapersonal:string;
}

export interface General {
    respiratoria: Comunes;
    cardiaca: Comunes;
    oxigenacion: Comunes;
    diastolica: Comunes;
    sistolica: Comunes;
    altura: Comunes;
    peso: Comunes;
    temperatura: Comunes;
    glucosa:Comunes;
    ocular: Comunes;
    verbal: Comunes;
    motora: Comunes;
    total: Comunes;
    imc: Comunes;
}

export interface Comunes {
    id?: number;
    codigo?: string;
    valor?: string;
}

