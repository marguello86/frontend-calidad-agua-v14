import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  fechaSistema(): string {
    var dateObj = new Date();
    var mes = dateObj.getUTCMonth() + 1; //months from 1-12
    var dia = dateObj.getUTCDate();
    var anio = dateObj.getUTCFullYear();
    var fecha = dia + '/' + mes + '/' + anio;
    console.info(anio.toString());
    return anio.toString();
  }
  fechaActual = this.fechaSistema();
  ngOnInit() {
  }
}
