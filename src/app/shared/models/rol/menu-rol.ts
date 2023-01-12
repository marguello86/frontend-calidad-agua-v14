export interface RolMenu {
  status: number;
  error?: any;
  message: string;
  data: DataRolMenu[];
}

export interface DataRolMenu {
  id?: number;
  miembro?: Miembro;
  rol?: Rol;
  sistema?: Sistema;
  pasivo?: boolean;
  fechapasivo?: string;
  usuarioregistro?: string;
  fecharegistro?: string;
  usuariomodificacion?: string;
  fechamodificacion?: string;
}

interface Sistema {
  id: number;
  nombre: string;
  descripcion: string;
  urllogo: string;
  urliniciointranet: string;
  urliniciointernet: string;
  agrupado: boolean;
  indlegacy: number;
  codigo: string;
  pasivo: boolean;
}

interface Rol {
  id: number;
  nombre: string;
  pasivo: boolean;
}

interface Miembro {
  id: number;
  indredservicios: boolean;
  pasivo: boolean;
}