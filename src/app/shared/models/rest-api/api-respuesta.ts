import { ApiError } from './api-error';

export class ApiRespuesta<T> {
  resultado: number;
  error?: ApiError;
  datos?: Array<T>;
  data?: Array<T>;

  constructor(resultado?: number, datos?: Array<T>, err?: number, msg?: string) {
    this.resultado = resultado;
    if (datos) { this.datos = datos; }
    if (err) { this.error = new ApiError(err, msg); }
  }
}
