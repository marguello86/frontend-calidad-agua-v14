export interface MenuRolAccion {
  status: number;
  error?: any;
  message: string;
  data: DataMenuRolAccion[];
}

export interface DataMenuRolAccion {
  id?: number;
  username?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  pasivo?: boolean;
  perfil?: Perfil;
  sistema?: Sistema;
}

interface Sistema {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  pasivo: boolean;
  relmiembrorol: Relmiembrorol[];
  menu: MenuRol[];
}

export interface Recurso {
  url: string;
}
export interface MenuRol {
  id: number;
  nombre: string;
  codigo: string;
  orden: number;
  recurso: Recurso;
  dependencia: number;
  pasivo: boolean;
  permisos: Permisos[];
  relmenurol: Relmiembrorol;
  class?:string;
}

export interface Permisos {
  id: number;
  catsup: number;
  codigo: string;
  valor: string;
  pasivo: boolean;
}

interface Relmiembrorol {
  id: number;
  nombre: string;
  pasivo: boolean;
}

interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
  pasivo: boolean;
}
