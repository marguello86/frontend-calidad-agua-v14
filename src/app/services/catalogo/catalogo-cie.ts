export interface CatalogoCIE {
  status: number;
  error?: any;
  message: string;
  data: DatosCIE[];
}

export interface DatosCIE {
  id: number;
  codigo?: string;
  nombre?: string;
  capitulo?: string;
  pasivo?: boolean;
  codigosup?: any;
  descripcion: string;
  limitadaaunsexo?: any;
  limiteinferiordeedad?: any;
  limitesuperiordeedad?: any;
  fetal?: string;
  periodo?: number;
  observacion?: any;
  usuarioregistro?: string;
  fecharegistro?: string;
}

export interface DiagnosticoCIE {
  id?: number;
  cie?: DatosCIE;
  diagnostico?: string;
  fecharegistro?: string;
}