import { LOGIN } from "./../../services/constantes";
//import { filter } from "rxjs/operators";
//import { THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";
import { DatePipe, formatDate } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
//import { NativeDateAdapter } from "@angular/material/datepicker";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CODE_SYSTEM } from "src/app/services/constantes";
import {
  DashboardService,
  HeaderService,
  LoginService,
  UsuarioService,
  LocalStorageAdminService,
} from "src/app/services/service.index";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
//import { DashboardExport } from "src/app/shared/models/reportes/dashboard-export";
//import { ExportExcel } from "src/app/services/export-exel.service";
export class PickDateAdapter extends MatDatepickerModule {
  locale: string; //!se agrego para que locale mas abajo no de error.!
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      this.locale = "es";
      return formatDate(date, "yyyy/MM/dd", this.locale, "GMT-0600");
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent extends LocalStorageAdminService
  implements OnInit {
  public date: Date = new Date();
  private isLocal: boolean = false;
  showDashBoard: boolean = false;
  public nameSystemModule: string = "";
  protected user;
  protected sistema;
  public url: string;
 
  constructor(
    private datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private seguridadService: LoginService,
    private usuarioService: UsuarioService,
    private headerService: HeaderService,
    private dashboardService: DashboardService,
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
   // private exportService: ExportExcel,
    private changeDetector: ChangeDetectorRef
  ) {
    super();    
    this.setNameSystemModule();
    this.usuarioService.getShowDashboard().subscribe((v) => {
      this.showDashBoard = v;
    });
    
    //debugger;
    this.isLocal = environment.local;
    if (this.activatedRoute.data) {

      this.activatedRoute.data.subscribe((t) =>
        t["titulo"]
          ? this.titleService.setTitle(CODE_SYSTEM + " | " + t["titulo"])
          : null
      );
    }
    if (
      this.seguridadService.getLocalStorageItem("JWT") &&
      this.seguridadService.getLocalStorageItem("userObj")
    ) {
      this.router.navigate(["dashboard"]);
    } else {
      this.router.navigate(["logout"]);
    }
  }

  private setNameSystemModule() {
    if (this.headerService.infoSis) {
      this.nameSystemModule = `${this.headerService.infoSis.nombre} - ${this.headerService.infoSis.nombreSecundario}`;
    }
  }

  ngOnInit() {
    if (this.showDashBoard) {        
    }
  }

  //INICIO CODIGO OBJETOS DAVID LOAISIGA



  //FIN CODIGO OBJETOS DAVID LOAISIGA
}
