export class ApiError {
  id: number;
  mensaje: string;

  constructor(id: number, mensaje: string) {
    this.id = id;
    this.mensaje = mensaje;
  }
}