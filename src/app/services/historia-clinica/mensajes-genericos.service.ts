import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajesGenericosService {
  constructor() {}

  msjGuardado(): void {
    Swal.fire({
      icon: 'success',
      text: '¡Registros Guardados Exitosamente!',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  msjActualizado(): void {
    Swal.fire({
      icon: 'success',
      text: '¡Registros Actualizado Exitosamente!',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  msjEliminado(): void {
    Swal.fire({
      icon: 'success',
      text: '¡Registros Eliminados Exitosamente!',
      showConfirmButton: false,
      timer: 1000,
    });
  }
  msjDuplicado(): void {
    Swal.fire({
      icon: 'warning',
      text: '¡No se premiten Registros Duplicados!',
    });
  }
  msjCampoRequerido(item: string): void {
    Swal.fire({
      icon: 'warning',
      text: 'Estimado Usuario, Favor completar el Campo ' + item,
    });
  }
}
