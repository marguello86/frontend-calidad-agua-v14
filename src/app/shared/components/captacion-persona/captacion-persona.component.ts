import { DatePipe, formatDate } from "@angular/common";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef, //,
  // OnChanges,
  // SimpleChange,
  // SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
// import {
//   NativeDateAdapter,
//   MatPaginator,
//   MatSort,
//   MatTableDataSource,
//   MatDialog,
// } from "@angular/material";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ESTRATEGIA } from "src/app/services/constantes";
import { NativeDateAdapter } from "@angular/material/core";

export class PickDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      this.locale = "es";
      return formatDate(date, "yyyy/MM/dd", this.locale, "GMT-0600");
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: "app-captacion-persona",
  templateUrl: "./captacion-persona.component.html",
  styleUrls: ["./captacion-persona.component.scss"],
})
export class CaptacionPersonaComponent implements OnInit {
  private subject$: Subject<void> = new Subject();

  constructor() {}

  ngOnInit() {}
}
