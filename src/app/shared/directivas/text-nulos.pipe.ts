import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textNulos'
})
export class TextNulosPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? value : 'N/A';
  }

}
