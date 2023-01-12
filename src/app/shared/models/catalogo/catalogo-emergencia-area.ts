interface CatalogoArea {
  status?: number;
  error?: any;
  message?: string;
  data?: DatosArea[];
}

interface DatosArea {
  id?: number;
  catalogosup?: number;
  codigo?: string;
  valor?: string;
  descripcion?: string;
  orden?: number;
  final1: number;
  pasivo?: boolean;
  usuarioregistro?: string;
  fecharegistro?: string;
  childrens?: Children[];
}

interface Children {
  id?: number;
  catalogosup?: number;
  codigo?: string;
  valor?: string;
  descripcion?: string;
  orden?: number;
  final1?: number;
  pasivo?: boolean;
  usuarioregistro?: string;
  fecharegistro?: string;
}