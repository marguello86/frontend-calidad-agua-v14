import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransformFechaService {
  datePipe = new DatePipe('en-US');
  constructor() { }
  transformFecha(fecha: Date): string {
    const hora: string = this.datePipe.transform(new Date(), 'HH:mm:ss');
    const dateFormat = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return dateFormat.concat(' ', hora);
  }
  compare(a: number | string | Date, b: number | string | Date, isAsc?: boolean) {
    return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
  }
  hasSeguimientos(seguimientos: any[]): boolean {
    return (seguimientos.find(s => s.id > 0)) ? true : false;
  }
  prechargedLastSeguimiento(seguimientos: any []): any {
    return (seguimientos).
    sort((a, b) => this.compare(a.numdiaseguimiento, b.numdiaseguimiento, false))[0];
  }
 }
