import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextTransform]'
})
export class TextTransformDirective {
  @Input('appTextTransform') typeTransform: string;
  constructor(private el: ElementRef) { }
  @HostListener('input') TransformarTexto() {
    switch (this.typeTransform) {
      case 'CA':
        this.el.nativeElement.style.textTransform = 'capitalize';
        break;
      case 'LC':
      this.el.nativeElement.style.textTransform = 'lowercase';
      break;
      default:
          this.el.nativeElement.style.textTransform = 'uppercase';
          break;
    }

  }

}
